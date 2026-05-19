export const resumeData = {
  name: "Mayur Kumar",
  title: "Embedded Software Engineer",
  promptUser: "root",
  promptHost: "Mayur",
  github: "https://github.com/Strong10mede",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/mayur-kumar",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "kmayur809@gmail.com",
  summary:
    "Embedded Software Engineer with 2+ years of hands-on experience developing, debugging, and upstreaming Linux kernel drivers on ARM-based SoC platforms. Expertise in kernel subsystems, low-level hardware interaction, ARM architecture, TF-A, TrustZone, and SMC.",
  skills: [
    "ARM AArch64",
    "ARM TrustZone",
    "GPT",
    "SMC",
    "Embedded Linux",
    "U-Boot",
    "Device Tree",
    "Linux Kernel up to 6.6",
    "OpenWrt",
    "I2C",
    "SPI",
    "UART",
    "MMIO"
  ],
  experience: [
    {
      company: "Airoha",
      role: "Embedded Software Engineer",
      period: "July 2024 - Present",
      highlights: [
        "Built GUID Partition Table support in ARM Trusted Firmware for EMMC flash.",
        "Contributed Linux kernel driver patches for multiple devices.",
        "Integrated proprietary kernel modules across Linux 6.6/6.12 and OpenWrt 23.05/24.10/25.12.",
        "Implemented SMC API for secure device authentication."
      ]
    },
    {
      company: "Airoha",
      role: "Embedded Software Intern",
      period: "Jan 2024 - June 2024",
      highlights: [
        "Developed Linux drivers for clk and watchdog subsystems.",
        "Upstreamed driver work to the mainline Linux Kernel."
      ]
    }
  ],
  projects: [
    {
      name: "Upstream Linux Watchdog Driver",
      file: "watchdog.txt",
      summary:
        "Designed hardware-based Linux Watchdog driver merged into mainline Linux v6.6+, integrated with CCF and Reset Controller APIs."
    },
    {
      name: "SoC Partition Scheme",
      file: "partition-scheme.txt",
      summary:
        "Designed GPT-based dynamic partitioning scheme, integrated with ARM Trusted Firmware at EL3/Secure Monitor."
    }
  ],
  education: {
    degree: "Dual Degree (CSE)",
    institution: "NIT Hamirpur",
    period: "2019 - 2024",
    cgpa: "9.29/10.0"
  }
};
