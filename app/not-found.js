"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const panicLines = [
  "BUG: unable to handle page fault for address: 0000000000000000",
  "#PF: supervisor read access in kernel mode",
  "#PF: error_code(0x0000) - not-present page",
  "PGD 0 P4D 0",
  "Oops: 0000 [#1] PREEMPT SMP NOPTI",
  "CPU: 0 PID: 404 Comm: next-router Not tainted 6.6.0-mayur-portfolio #1",
  "RIP: 0010:mount_root+0x404/0x7ff",
  "RSP: 0018:ffffc90000003d90 EFLAGS: 00010246",
  "RAX: 0000000000000000 RBX: ffffffff82a40400 RCX: 0000000000000000",
  "RDX: 0000000000000000 RSI: ffffffff82404f04 RDI: 0000000000000000",
  "RBP: ffffc90000003e20 R08: 0000000000000001 R09: 0000000000000000",
  "R10: ffffffff82200000 R11: 0000000000000246 R12: 0000000000000000",
  "R13: ffffffff82a40440 R14: 00000000000001a4 R15: 0000000000000000",
  "Call Trace:",
  "  <TASK>",
  "  lookup_fast+0x91/0x120",
  "  path_openat+0x2a8/0x1160",
  "  do_filp_open+0xb2/0x150",
  "  do_sys_openat2+0x9b/0x160",
  "  __x64_sys_openat+0x55/0xa0",
  "  do_syscall_64+0x5c/0x90",
  "  entry_SYSCALL_64_after_hwframe+0x6e/0xd8",
  "  </TASK>",
  "CR2: 0000000000000000 CR3: 000000000260a000 CR4: 0000000000350ef0",
  "Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)."
];

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const reboot = () => router.push("/");

    window.addEventListener("keydown", reboot);
    window.addEventListener("pointerdown", reboot);

    return () => {
      window.removeEventListener("keydown", reboot);
      window.removeEventListener("pointerdown", reboot);
    };
  }, [router]);

  return (
    <main className="flex h-[100dvh] w-screen flex-col justify-between overflow-hidden bg-black p-4 font-terminal text-xs leading-5 text-white sm:p-8 sm:text-sm">
      <pre className="whitespace-pre-wrap break-words">
        {panicLines.join("\n")}
      </pre>

      <p className="animate-pulse text-[#d5d5d5]">
        [ Press any key to reboot and return to terminal ]
      </p>
    </main>
  );
}
