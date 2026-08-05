# Raspberry Pi Kiosk — run Uni-Learn on any TV via HDMI

A TV cannot boot software from a USB drive — its firmware only knows how to
open its own OS. This folder turns a Raspberry Pi into the thing that
*does* boot from storage: it boots straight into a fullscreen browser
showing the app, and you plug the Pi into the TV's HDMI port. Any TV with
HDMI works, since HDMI is universal — the TV itself never needs to "run"
anything.

## What you need

- Raspberry Pi 4 (2GB+) — a Pi Zero 2 W works but will feel more sluggish
- microSD card, 16GB or larger
- Raspberry Pi power supply
- micro-HDMI → HDMI cable (Pi 4 uses micro-HDMI)
- A computer to flash the SD card and run `deploy.sh` from (this Mac works)

## 1) Flash the SD card

Use [Raspberry Pi Imager](https://www.raspberrypi.com/software/).

- Choose OS: **Raspberry Pi OS (Legacy, 32-bit) — "Bullseye" with Desktop**.
  Pick *Legacy* specifically — it uses the classic X11/LXDE desktop, which
  is what the kiosk autostart script below targets. Newer Raspberry Pi OS
  versions ("Bookworm") default to a different desktop stack (Wayland) and
  would need different autostart paths — stick with Legacy unless you want
  to adapt this yourself.
- In the Imager's gear/advanced-options icon (before writing), set:
  - Hostname: `totolearn` (or anything — just note it)
  - Enable SSH, with a password (or your public key)
  - Configure your Wi-Fi SSID/password so the Pi joins your network on
    first boot
  - Set a username/password (default is often `pi`)
- Write the image, insert the SD card into the Pi, power it on, and give
  it a minute or two to boot and join Wi-Fi.

## 2) Find the Pi and SSH in

```bash
ssh pi@totolearn.local   # or whatever hostname/username you set
```

If `.local` mDNS resolution doesn't work, check your router's admin page
for the Pi's IP address instead.

## 3) Copy the provisioning script over and run it

From this Mac, in the project root:

```bash
scp pi-kiosk/setup.sh pi@totolearn.local:~/
ssh pi@totolearn.local 'chmod +x ~/setup.sh && ~/setup.sh'
```

This installs Chromium + `unclutter` (hides the mouse cursor), sets up a
systemd service that serves the app on `localhost:8080`, and configures
the desktop to auto-launch Chromium in kiosk mode pointed at that URL,
with the screensaver/screen-blanking disabled.

## 4) Enable desktop auto-login

One manual, interactive step (values here can drift between OS releases,
so this is safer done by hand than scripted):

```bash
sudo raspi-config
```

Go to **System Options → Boot / Auto Login → Desktop Autologin**, then
reboot:

```bash
sudo reboot
```

The Pi should come up straight into the app, fullscreen, no desktop chrome
visible.

## 5) Deploy the app itself

`setup.sh` sets up the *server*, but doesn't put the app's files on the
Pi. From this Mac:

```bash
pi-kiosk/deploy.sh pi@totolearn.local
```

This runs `next build` locally, then `rsync`s the static export to the Pi
and restarts its server. Re-run this any time you make changes to the app
— no need to redo steps 1–4.

## Troubleshooting notes (untested on real hardware)

I put this together from the standard, well-documented Raspberry Pi kiosk
recipe, but haven't run it against physical hardware — treat step 3/4 as
a strong starting point rather than a guarantee. Likely friction points:

- If Chromium doesn't appear fullscreen: check
  `~/.config/lxsession/LXDE-pi/autostart` on the Pi exists and has the
  `chromium-browser --kiosk ...` line from `setup.sh`.
- If the screen goes blank after a while: the `xset` lines in that same
  autostart file handle this — confirm they're present.
- If nothing loads at all: SSH in and check
  `systemctl status totolearn-server` and `curl localhost:8080` — that
  tells you whether it's a server problem or a Chromium/autostart problem.
