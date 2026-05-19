"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

const GLYPHS =
  "\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e6\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const SHIP_SPRITES = {
  "-1": [
    [
      "        /\\",
      "  ___ /==\\ ___",
      "<==<__[ARM_SOC]__>",
      "    /_/  \\_\\",
      "     /____\\"
    ],
    [
      "       .-.",
      "  ___ /___\\ ___",
      "<=={ TZ  SMC }",
      "    \\_==_/",
      "      /_\\"
    ]
  ],
  1: [
    [
      "     /\\",
      " ___/==\\ ___",
      "<__[ARM_SOC]__>==>",
      "   /_/  \\_\\",
      "    /____\\"
    ],
    [
      "      .-.",
      " ___ /___\\ ___",
      "{ GPT  BUS }==>",
      "   \\_==_/",
      "     /_\\"
    ]
  ]
};

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function MatrixBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });

    if (!canvas || !context) return undefined;

    let animationFrameId;
    let lastFrame = 0;
    let fontSize = 16;
    let columns = 0;
    let drops = [];
    let craft = [];
    let shots = [];
    let shipFontSize = 16;
    let lineHeight = 16;

    const measureShip = (lines) =>
      Math.max(...lines.map((line) => context.measureText(line).width));

    const spawnShip = (direction = Math.random() > 0.5 ? 1 : -1) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const diagonal = Math.random() > 0.28;
      const fromUpperBand = Math.random() > 0.5;
      const lines = pickRandom(SHIP_SPRITES[direction]);
      const estimatedWidth = Math.max(...lines.map((line) => line.length)) * shipFontSize * 0.62;
      const y = diagonal
        ? fromUpperBand
          ? randomBetween(-36, Math.max(70, height * 0.34))
          : randomBetween(height * 0.62, height + 32)
        : randomBetween(70, Math.max(100, height - 150));

      return {
        direction,
        fireCooldown: randomBetween(8, 22),
        lines,
        speed: randomBetween(5.6, 10.8),
        width: estimatedWidth,
        x:
          direction === 1
            ? randomBetween(-estimatedWidth - 260, -estimatedWidth - 80)
            : randomBetween(width + 80, width + 320),
        y,
        vy: diagonal
          ? fromUpperBand
            ? randomBetween(0.55, 1.45)
            : randomBetween(-1.45, -0.55)
          : randomBetween(-0.28, 0.28)
      };
    };

    const resetShip = (ship) => {
      Object.assign(ship, spawnShip(Math.random() > 0.5 ? 1 : -1));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      fontSize = width < 640 ? 13 : 16;
      shipFontSize = width < 640 ? 13 : 17;
      lineHeight = shipFontSize * 0.92;
      columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * height) / fontSize)
      );

      if (!craft.length) {
        craft = Array.from({ length: width < 700 ? 3 : 5 }, (_, index) =>
          spawnShip(index % 2 === 0 ? -1 : 1)
        );
      }
    };

    const fireShot = (ship) => {
      const target = craft.find(
        (candidate) => candidate !== ship && candidate.direction !== ship.direction
      );
      const muzzleX = ship.direction === 1 ? ship.x + ship.width + 8 : ship.x - 10;
      const muzzleY = ship.y + lineHeight * 1.9;
      const fallbackAngle = ship.direction === 1 ? 0 : Math.PI;
      const angle = target
        ? Math.atan2(target.y - ship.y, target.x - ship.x)
        : fallbackAngle + randomBetween(-0.12, 0.12);
      const speed = randomBetween(10.5, 16.5);

      shots.push({
        life: randomBetween(24, 38),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        x: muzzleX,
        y: muzzleY
      });
    };

    const drawSpacecraft = () => {
      context.save();
      context.font = `${shipFontSize}px "Fira Code", "Courier New", monospace`;
      context.textBaseline = "top";
      context.shadowBlur = 12;
      context.shadowColor = theme.colors.accent;

      craft.forEach((ship) => {
        ship.width = measureShip(ship.lines);
        ship.x += ship.direction * ship.speed;
        ship.y += ship.vy;
        ship.fireCooldown -= 1;

        if (ship.fireCooldown <= 0) {
          fireShot(ship);
          ship.fireCooldown = randomBetween(9, 24);
        }

        if (
          (ship.direction === 1 && ship.x > window.innerWidth + 240) ||
          (ship.direction === -1 && ship.x < -ship.width - 260) ||
          ship.y < -130 ||
          ship.y > window.innerHeight + 90
        ) {
          resetShip(ship);
        }

        context.globalAlpha = 0.86;
        context.fillStyle = ship.direction === 1 ? theme.colors.text : theme.colors.accent;

        ship.lines.forEach((line, index) => {
          context.fillText(line, ship.x, ship.y + index * lineHeight);
        });

        context.globalAlpha = 0.42;
        context.fillStyle = theme.colors.accent2;
        const exhaustX = ship.direction === 1 ? ship.x - 16 : ship.x + ship.width + 8;
        context.fillText(ship.direction === 1 ? "<<<" : ">>>", exhaustX, ship.y + lineHeight * 2);
      });

      shots = shots
        .map((shot) => ({
          ...shot,
          life: shot.life - 1,
          x: shot.x + shot.vx,
          y: shot.y + shot.vy
        }))
        .filter(
          (shot) =>
            shot.life > 0 &&
            shot.x > -120 &&
            shot.x < window.innerWidth + 120 &&
            shot.y > -120 &&
            shot.y < window.innerHeight + 120
        );

      shots.forEach((shot) => {
        context.globalAlpha = Math.min(1, shot.life / 16);
        context.strokeStyle = Math.random() > 0.25 ? "#ffffff" : theme.colors.accent;
        context.lineWidth = 1.8;
        context.beginPath();
        context.moveTo(shot.x, shot.y);
        context.lineTo(shot.x - shot.vx * 1.9, shot.y - shot.vy * 1.9);
        context.stroke();
      });

      context.restore();
    };

    const draw = (timestamp) => {
      animationFrameId = window.requestAnimationFrame(draw);

      if (timestamp - lastFrame < 34) return;
      lastFrame = timestamp;

      context.fillStyle = theme.colors.matrixFade;
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.font = `${fontSize}px "Fira Code", "Courier New", monospace`;
      context.textBaseline = "top";

      for (let column = 0; column < columns; column += 1) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = column * fontSize;
        const y = drops[column] * fontSize;

        context.fillStyle =
          Math.random() > 0.985 ? theme.colors.text : theme.colors.matrix;
        context.fillText(glyph, x, y);

        if (y > window.innerHeight && Math.random() > 0.972) {
          drops[column] = 0;
        } else {
          drops[column] += 1;
        }
      }

      drawSpacecraft();
    };

    resize();
    context.fillStyle = theme.colors.page;
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    animationFrameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen bg-[color:var(--theme-page)]"
    />
  );
}
