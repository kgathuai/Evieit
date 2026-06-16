# Samsung Tizen TV Sideload Package

This folder packages Uni-Learn for **Samsung Tizen TV** (specific platform target).

## 1) Build an unsigned widget package

From the project root:

```bash
chmod +x tizen/package-tizen.sh
./tizen/package-tizen.sh
```

Output:

- `tizen/dist/UniLearnUSB-unsigned.wgt`

## 2) Sign with Tizen Studio (required for install)

Install Tizen Studio and create a certificate profile, then run:

```bash
tizen package -t wgt -s <certificate-profile-name> -- tizen/.build
```

This produces a signed `.wgt` package.

## 3) Install on Samsung TV (Developer Mode)

1. Enable Developer Mode on TV.
2. Connect TV and computer to same network.
3. Use `sdb connect <TV_IP>`.
4. Install signed package:

```bash
sdb install <signed-package>.wgt
```

## Notes

- `tizen/config.xml` defines TV profile, app id, and entry point.
- Replace the placeholder icon with branded art before distribution.
- Web Speech API voice availability may vary by TV model/firmware.
