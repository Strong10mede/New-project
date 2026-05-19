"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

const STORAGE_KEY = "mayur-tux-runner-high-score";
const GRAVITY = 2200;
const JUMP_VELOCITY = -780;
const BUG_MIN_GAP = 0.82;
const BUG_RANDOM_GAP = 0.78;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readHighScore() {
  if (typeof window === "undefined") return 0;

  const saved = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) || "0", 10);
  return Number.isFinite(saved) ? saved : 0;
}

function drawPixelTux(context, player, accent) {
  const { x, y, width, height } = player;
  const unit = width / 9;

  context.fillStyle = "#050505";
  context.fillRect(x + unit * 2, y, unit * 5, unit * 2);
  context.fillRect(x + unit, y + unit * 2, unit * 7, unit * 4);
  context.fillRect(x + unit * 2, y + unit * 6, unit * 5, height - unit * 6);

  context.fillStyle = "#f5f7ef";
  context.fillRect(x + unit * 2.4, y + unit * 2.6, unit * 4.2, unit * 3.7);
  context.fillRect(x + unit * 3, y + unit * 6.2, unit * 3, unit * 2.2);

  context.fillStyle = accent;
  context.fillRect(x + unit * 3.5, y + unit * 1.2, unit, unit);
  context.fillRect(x + unit * 5.1, y + unit * 1.2, unit, unit);

  context.fillStyle = "#ffb02e";
  context.fillRect(x + unit * 4, y + unit * 2.2, unit * 1.4, unit * 0.8);
  context.fillRect(x + unit * 1.2, y + height - unit, unit * 2.4, unit);
  context.fillRect(x + unit * 5.3, y + height - unit, unit * 2.4, unit);
}

function drawBug(context, bug) {
  const { x, y, width, height } = bug;

  context.fillStyle = "#ff405d";
  context.fillRect(x, y, width, height);
  context.fillStyle = "#8a0016";
  context.fillRect(x + 4, y + 4, width - 8, 5);
  context.fillStyle = "#ffd7dd";
  context.fillRect(x + width * 0.2, y + height * 0.25, 5, 5);
  context.fillRect(x + width * 0.64, y + height * 0.25, 5, 5);
  context.fillStyle = "#000";
  context.fillRect(x + width * 0.25, y + height * 0.7, width * 0.5, 3);
}

function collides(a, b) {
  const padding = 8;

  return (
    a.x + padding < b.x + b.width &&
    a.x + a.width - padding > b.x &&
    a.y + padding < b.y + b.height &&
    a.y + a.height - padding > b.y
  );
}

export default function TuxGame({ onExit }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const frameRef = useRef(null);
  const loopRef = useRef(null);
  const gameRef = useRef(null);
  const { theme } = useTheme();

  const draw = useCallback(
    (context, game) => {
      const { width, height, groundY, player, bugs, score, highScore, speed } = game;

      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(0,0,0,0.92)");
      gradient.addColorStop(1, theme.colors.terminalStrong);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < 48; i += 1) {
        const x = (i * 173 + Math.floor(score * 0.8)) % width;
        const y = (i * 89) % Math.max(1, groundY - 32);
        context.fillRect(x, y, 2, 2);
      }

      context.strokeStyle = theme.colors.border;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, groundY);
      context.lineTo(width, groundY);
      context.stroke();

      context.fillStyle = theme.colors.accent;
      for (let x = -((score * 0.42) % 44); x < width + 44; x += 44) {
        context.fillRect(x, groundY + 12, 24, 3);
      }

      bugs.forEach((bug) => drawBug(context, bug));
      drawPixelTux(context, player, theme.colors.accent);

      context.font = '700 14px "Fira Code", "Courier New", monospace';
      context.fillStyle = theme.colors.text;
      context.fillText(`SCORE ${score}`, 18, 30);
      context.fillText(`HI ${highScore}`, 18, 52);
      context.fillStyle = theme.colors.muted;
      context.fillText(`SPEED ${Math.round(speed)}`, width - 118, 30);

      if (game.gameOver) {
        context.fillStyle = "rgba(0,0,0,0.78)";
        context.fillRect(0, 0, width, height);
        context.textAlign = "center";
        context.fillStyle = "#ff405d";
        context.font = '700 26px "Fira Code", "Courier New", monospace';
        context.fillText("KERNEL PANIC - GAME OVER", width / 2, height / 2 - 64);
        context.fillStyle = theme.colors.text;
        context.font = '700 16px "Fira Code", "Courier New", monospace';
        context.fillText(`Final score: ${score}`, width / 2, height / 2 - 24);
        context.fillText(`High score: ${game.highScore}`, width / 2, height / 2 + 4);
        context.fillStyle = theme.colors.muted;
        context.font = '13px "Fira Code", "Courier New", monospace';
        context.fillText("Press [ENTER] to restart, or [ESC] to exit to terminal", width / 2, height / 2 + 46);
        context.textAlign = "left";
      }
    },
    [theme]
  );

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 420;
    const groundY = Math.floor(height * 0.78);
    const playerWidth = clamp(width * 0.055, 34, 48);
    const playerHeight = playerWidth * 1.18;

    gameRef.current = {
      width,
      height,
      groundY,
      lastTime: 0,
      elapsed: 0,
      score: 0,
      highScore: readHighScore(),
      speed: clamp(width * 0.33, 260, 420),
      spawnTimer: 0.72,
      gameOver: false,
      player: {
        x: clamp(width * 0.16, 56, 130),
        y: groundY - playerHeight,
        width: playerWidth,
        height: playerHeight,
        vy: 0,
        grounded: true
      },
      bugs: []
    };

    if (!frameRef.current && loopRef.current) {
      frameRef.current = window.requestAnimationFrame(loopRef.current);
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrapper.getBoundingClientRect();

    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext("2d");
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);

    const previous = gameRef.current;
    resetGame();

    if (previous && gameRef.current) {
      gameRef.current.highScore = previous.highScore;
    }
  }, [resetGame]);

  const jump = useCallback(() => {
    const game = gameRef.current;
    if (!game || game.gameOver || !game.player.grounded) return;

    game.player.vy = JUMP_VELOCITY;
    game.player.grounded = false;
  }, []);

  const loop = useCallback(
    (timestamp) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const game = gameRef.current;

      if (!canvas || !context || !game) {
        frameRef.current = null;
        return;
      }

      if (!game.lastTime) {
        game.lastTime = timestamp;
      }

      const delta = Math.min((timestamp - game.lastTime) / 1000, 0.033);
      game.lastTime = timestamp;
      game.elapsed += delta;
      game.score = Math.floor(game.elapsed * 10);
      game.speed = clamp(game.speed + delta * 5.5, 260, 620);

      game.player.vy += GRAVITY * delta;
      game.player.y += game.player.vy * delta;

      if (game.player.y >= game.groundY - game.player.height) {
        game.player.y = game.groundY - game.player.height;
        game.player.vy = 0;
        game.player.grounded = true;
      }

      game.spawnTimer -= delta;

      if (game.spawnTimer <= 0) {
        const bugHeight = clamp(game.height * 0.085, 28, 44);
        const bugWidth = bugHeight * 1.1;

        game.bugs.push({
          x: game.width + bugWidth,
          y: game.groundY - bugHeight,
          width: bugWidth,
          height: bugHeight
        });
        game.spawnTimer = BUG_MIN_GAP + Math.random() * BUG_RANDOM_GAP;
      }

      game.bugs = game.bugs
        .map((bug) => ({
          ...bug,
          x: bug.x - game.speed * delta
        }))
        .filter((bug) => bug.x + bug.width > -20);

      if (game.bugs.some((bug) => collides(game.player, bug))) {
        game.gameOver = true;
        game.highScore = Math.max(game.score, game.highScore);
        window.localStorage.setItem(STORAGE_KEY, String(game.highScore));
        draw(context, game);
        frameRef.current = null;
        return;
      }

      draw(context, game);
      frameRef.current = window.requestAnimationFrame(loop);
    },
    [draw]
  );

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") {
        event.preventDefault();
        onExit?.();
        return;
      }

      if (event.code === "Enter" && gameRef.current?.gameOver) {
        event.preventDefault();
        resetGame();
        return;
      }

      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        jump();
      }
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = null;
      observer.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [jump, onExit, resetGame, resizeCanvas]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden bg-black"
      role="application"
      aria-label="Tux platformer game"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded border border-white/10 bg-black/40 px-3 py-2 font-terminal text-xs text-[color:var(--theme-muted)] backdrop-blur">
        Space / Up: jump | ESC: terminal
      </div>
    </div>
  );
}
