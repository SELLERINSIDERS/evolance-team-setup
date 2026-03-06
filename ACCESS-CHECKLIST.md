# Access Checklist — Who Gets What

## Step 1: Team Members Create GitHub Accounts

Each person creates a free account at github.com and sends you their username.

| Person | Email to use | GitHub username | Done? |
|--------|-------------|----------------|-------|
| Xeniya | (her email) | _______________ | [ ] |
| Vitalii | (his email) | _______________ | [ ] |
| Olga | (her email) | _______________ | [ ] |

## Step 2: Invite to SELLERINSIDERS Org

Run these commands once you have their usernames:

```bash
gh org invite <xeniya-username> --org SELLERINSIDERS
gh org invite <vitalii-username> --org SELLERINSIDERS
gh org invite <olga-username> --org SELLERINSIDERS
```

They need to accept the invitation (email or github.com/orgs/SELLERINSIDERS/invitation).

## Step 3: Grant Repo Access

### Xeniya (Co-owner — Shopify, Operations)
```bash
gh api repos/SELLERINSIDERS/evolance-team-setup/collaborators/<xeniya-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-shopify/collaborators/<xeniya-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-operations/collaborators/<xeniya-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/shared-company-brain/collaborators/<xeniya-username> -X PUT -f permission=push
```

### Vitalii (Admin/Ops — Amazon, Operations)
```bash
gh api repos/SELLERINSIDERS/evolance-team-setup/collaborators/<vitalii-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-amazon/collaborators/<vitalii-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-operations/collaborators/<vitalii-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/shared-company-brain/collaborators/<vitalii-username> -X PUT -f permission=pull
```

### Olga (Marketing — Meta Ads, Influencers)
```bash
gh api repos/SELLERINSIDERS/evolance-team-setup/collaborators/<olga-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-meta-ads/collaborators/<olga-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-influencers/collaborators/<olga-username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/shared-company-brain/collaborators/<olga-username> -X PUT -f permission=pull
```

## Step 4: Distribute API Keys

Each person needs their own `.env` file. You control which keys each person gets.

### Xeniya gets:
- [ ] SUPABASE_URL + SUPABASE_SERVICE_KEY (full read/write)
- [ ] CLICKUP_API_TOKEN (full workspace access)
- [ ] KLAVIYO_API_KEY

### Vitalii gets:
- [ ] SUPABASE_URL + SUPABASE_SERVICE_KEY (full read/write)
- [ ] CLICKUP_API_TOKEN (full workspace access)
- [ ] Amazon Ads credentials (if applicable)

### Olga gets:
- [ ] SUPABASE_URL + SUPABASE_SERVICE_KEY (full read/write)
- [ ] CLICKUP_API_TOKEN (full workspace access)
- [ ] KLAVIYO_API_KEY

### How to share keys securely:
- Do NOT send keys over Telegram or email in plain text
- Use a secure method: 1Password shared vault, Signal disappearing messages, or in-person

## Step 5: Each Person Follows ONBOARDING.md

Send them: https://github.com/SELLERINSIDERS/evolance-team-setup/blob/main/ONBOARDING.md

## Step 6: Verify Everything Works

For each person, confirm:
- [ ] Can open project in VS Code and see Claude Code working
- [ ] Can query Supabase: `supabase_search_learnings(query="test")`
- [ ] Can see ClickUp tasks: `clickup_list_tasks()`
- [ ] Skills show up when typing `/` in Claude Code
- [ ] Shared brain content accessible at `shared/products/`, `shared/brand/`

## Step 7: Merge Shopify PR

The existing `evolance-shopify` repo has a pending PR with Claude Code setup:
https://github.com/SELLERINSIDERS/evolance-shopify/pull/2

Merge it so Xeniya gets the full setup when she clones.
