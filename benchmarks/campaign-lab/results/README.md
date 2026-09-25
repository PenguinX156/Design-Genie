# Campaign Lab comparison, 2026-09-25

The same brief, content, data, HTML structure, and filter script were used in both variants. The baseline uses a conventional gradient hero and repeated cards. The treatment follows the recorded editorial direction with a typographic hierarchy, ruled data rows, and a restrained accent block.

| Check | Baseline | Treatment |
| --- | --- | --- |
| 1440/768/390 px screenshots | Captured | Captured |
| Horizontal overflow | None at all three widths | None at all three widths |
| Console errors after shared-script fix | None | None |
| axe WCAG A/AA rules | Serious color contrast violation at all three widths | No detected violations at all three widths |
| Filter interaction | Active → All → Active works by mouse and keyboard | Active → All → Active works by mouse and keyboard |
| Visual identity | Standard dashboard cards and gradient hero | Editorial type, campaign index, and dark workspace rail |

The first treatment audit also found color contrast problems. The visual critic and axe results led to darker secondary labels and slightly larger small text. The fixture server initially failed to serve the shared filter script; the interaction check exposed that fault. The final treatment was recaptured and audited after both fixes.

Screenshots: [baseline desktop](baseline/desktop.png), [baseline tablet](baseline/tablet.png), [baseline mobile](baseline/mobile.png); [treatment desktop](treatment/desktop.png), [treatment tablet](treatment/tablet.png), [treatment mobile](treatment/mobile.png). Machine results: [baseline audit](baseline/audit.json), [treatment audit](treatment/audit.json).

**Limits:** This is one author and one product, with no blind human preference test and no independent agent runs. It demonstrates that the loop caught real accessibility and interaction failures. It does not establish a general visual-quality lift. Navigation timings are local development observations, not Lighthouse scores or production performance results.
