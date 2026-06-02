# Digioh Zeta ZMP App — QA Environment

This repo contains the static site files for QA-testing the **Digioh Zeta ZMP App** extension on Netlify. It replicates the Zeta environment that the extension expects on the client's live site, allowing internal end-to-end validation before releasing updates.

The extension integrates Digioh forms with Zeta's marketing platform (ZMP). It handles interest preselection in form dropdowns based on Zeta scoring data, and submits lead payloads to Zeta on form submit. Since the extension depends on Zeta-specific globals (`window.zt_wp`, `window.bt`), this repo provides mock implementations of both.

## File Structure

```
index.html          — Test page with the Digioh embed
zmp-mock.js         — Mocks window.zt_wp (Zeta scoring data) and window.bt() (submission logger)
zmp-overrides.csv   — CSV used for Feature 2 (URL-based interest override) testing
```

## One-Time Setup

### 1. Fill in your Digioh account GUID

Open `config.js` and replace the placeholder with your actual account GUID:

```js
window.ZMP_CONFIG = {
    accountGuid: 'YOUR_ACCOUNT_GUID'
};
```

Ask Khizer if you don't have it. Commit the file — the GUID is a public embed ID, not a secret.

### 2. Deploy to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and log in (or create a free account)
2. On the dashboard, find **"Want to deploy a new site without connecting to Git?"**
3. Click **Deploy manually** — or drag this repo folder into the drag-and-drop zone
4. Wait ~10 seconds. Netlify will assign a URL like `https://curious-fox-a1b2c3.netlify.app`

To update files later: drag the folder into the same deploy zone again. The URL stays the same.

Alternatively, connect this GitHub repo to Netlify for automatic deploys on push.

### 3. Verify all three files are live

| File | URL |
|---|---|
| Test page | `https://your-site.netlify.app/` |
| Mock script | `https://your-site.netlify.app/zmp-mock.js` |
| Override CSV | `https://your-site.netlify.app/zmp-overrides.csv` |

If any file returns 404, check that the filename casing and extension exactly match.

### 4. Configure Digioh account metadata

In **Digioh → Admin → Account Metadata**, add:

| Key | Value |
|---|---|
| `zmp_init_js_url` | `https://your-site.netlify.app/zmp-mock.js` |
| `lead_event_name` | `lead_signed_up` |

### 5. Set up the test box in Digioh

Create a box in your QA Digioh account with:

**Fields:**
- Email field — field metadata: `zmp_export_prop` = `email`
- Dropdown field — options: `interest_sidebar`, `interest_leave_intent`, `interest_inline`, `interest_custom` — field metadata: `zmp_export_prop` = `interest_id`

**Page-level metadata (main form page):**
- `zmp_submit` = *(leave value blank — key just needs to exist)*

### 6. Install the ZMP App extension

In **Digioh → Extensions**, install the **Digioh Zeta ZMP App sandbox version**. Ask Khizer for the sandbox extension ID.

### 7. Confirm setup is working

Open `https://your-site.netlify.app/?boxqamode`, trigger the box, and look for this blue message in the QA panel at the bottom of the page:

```
Preselected interest interest_sidebar in drop down [selector]
```

If you see this, setup is complete.

## Running Tests

Always append `?boxqamode` to the URL before testing — the QA panel does not appear without it. Open **browser DevTools → Console** before each test to capture `bt()` mock logs.

Full feature test matrix with pass criteria, fail indicators, and evidence requirements for all 8 features:

| Feature | What it tests |
|---|---|
| 1 | Score-based interest preselect |
| 1b | Top-3 fallback when top interest is missing from dropdown |
| 2 | URL + CSV interest override |
| 3 | `bt('track')` form submission payload |
| 4 | PII anonymization (`zmp_pii_anon`) |
| 5 | Form submit override (skip `bt` call) |
| 6 | Data model validation (required fields) |
| 7 | Regex field validation (`rx_validate`) |
| 8 | DZMP retry cap (10s timeout when Zeta data never loads) |

## Adjusting Mock Data

To change which interest gets preselected, edit the scores in `zmp-mock.js` — whichever `top_products` value is highest wins:

```js
top_products: {
    interest_sidebar: 80,       // ← currently wins
    interest_leave_intent: 60,
    interest_inline: 20
}
```

Save and redeploy (drag folder into Netlify again). The URL stays the same.
