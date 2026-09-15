<template>
  <div class="mock">
    <div class="mock-bar">
      <span class="mock-dot" /><span class="mock-dot" /><span
        class="mock-dot"
      />
      <span class="mock-title">HTTP History</span>
      <span class="mock-grow" />
      <span class="mock-field is-focus">GET /api</span>
      <button class="mock-btn is-primary">Send</button>
      <button class="mock-btn is-danger">Drop</button>
      <button class="mock-btn is-disabled" disabled>Replay</button>
    </div>

    <div class="mock-body">
      <nav class="mock-side">
        <span class="mock-nav is-on">History</span>
        <span class="mock-nav">Search</span>
        <span class="mock-nav">Replay</span>
        <span class="mock-nav">Sitemap</span>
        <span class="mock-nav">Findings</span>
      </nav>

      <div class="mock-main">
        <table class="mock-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Method</th>
              <th>Host</th>
              <th>Path</th>
              <th>Status</th>
              <th>Len</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>412</td>
              <td>GET</td>
              <td>api.caido.io</td>
              <td>/v1/session</td>
              <td class="ok">200</td>
              <td>1.2k</td>
            </tr>
            <tr class="is-selected">
              <td>413</td>
              <td>POST</td>
              <td>api.caido.io</td>
              <td>/v1/login</td>
              <td class="ok">200</td>
              <td>842</td>
            </tr>
            <tr class="is-tagged">
              <td>414</td>
              <td>GET</td>
              <td>api.caido.io</td>
              <td>/v1/admin</td>
              <td class="bad">403</td>
              <td>96</td>
            </tr>
            <tr>
              <td>415</td>
              <td>GET</td>
              <td>cdn.caido.io</td>
              <td>/assets/app.js</td>
              <td class="ok">200</td>
              <td>88k</td>
            </tr>
            <tr>
              <td>416</td>
              <td>PUT</td>
              <td>api.caido.io</td>
              <td>/v1/user/7</td>
              <td class="warn">302</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>

        <div class="mock-panes">
          <pre class="mock-pane">
POST /v1/login HTTP/1.1
Host: api.caido.io
Content-Type: application/json

{"user":"admin"}</pre
          >
          <pre class="mock-pane">
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: sid=0O1lI...

{"ok":true}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mock {
  display: flex;
  flex-direction: column;
  min-height: 340px;
}
.mock-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  background: var(--c-bg-raised);
  border-bottom: 1px solid var(--c-border-separator);
}
.mock-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: var(--c-border-control);
  opacity: 0.5;
}
.mock-title {
  margin-left: 8px;
  font-weight: 600;
  font-size: 14px;
}
.mock-grow {
  flex: 1;
}
.mock-field {
  height: 28px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border: 1px solid var(--c-border-control);
  border-radius: 6px;
  background: var(--c-bg-inset);
  color: var(--c-fg-default);
  font-family: "Courier New", monospace;
  font-size: 13px;
}
.mock-field.is-focus {
  outline: 2px solid var(--c-focus-ring);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--c-focus-ring);
}
.mock-btn {
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.mock-btn.is-primary {
  background: var(--c-accent-solid);
  color: var(--c-fg-onsolid);
}
.mock-btn.is-danger {
  background: transparent;
  color: var(--c-danger-fg);
  border-color: var(--c-danger-fg);
}
.mock-btn.is-disabled {
  background: var(--c-bg-disabled);
  color: var(--c-fg-faint);
  border-color: transparent;
  cursor: not-allowed;
}

.mock-body {
  display: grid;
  grid-template-columns: 132px 1fr;
  flex: 1;
}
.mock-side {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  border-right: 1px solid var(--c-border-separator);
  background: var(--c-bg-canvas);
}
.mock-nav {
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--c-fg-muted);
}
.mock-nav.is-on {
  background: var(--c-bg-selected);
  color: var(--c-fg-default);
  font-weight: 500;
}

.mock-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.mock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
}
.mock-table th {
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--c-fg-muted);
  padding: 6px 10px;
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border-separator);
}
.mock-table td {
  padding: 5px 10px;
  border-bottom: 1px solid var(--c-border-separator);
}
.mock-table tr.is-selected td {
  background: var(--c-bg-selected);
}
.mock-table tr.is-tagged td {
  background: var(--c-tag-row);
  color: var(--c-tag-ink);
}
.mock-table .ok {
  color: var(--c-success-fg);
}
.mock-table .bad {
  color: var(--c-danger-fg);
}
.mock-table .warn {
  color: var(--c-gold-fg);
}
.mock-table tr.is-tagged .bad {
  color: var(--c-tag-ink);
}

.mock-panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  border-top: 1px solid var(--c-border-separator);
}
.mock-pane {
  margin: 0;
  padding: 10px 12px;
  overflow: hidden;
  font-family: "Courier New", monospace;
  font-size: 13px;
  line-height: 18px;
  color: var(--c-fg-muted);
  background: var(--c-bg-canvas);
  white-space: pre-wrap;
}
.mock-pane + .mock-pane {
  border-left: 1px solid var(--c-border-separator);
}
</style>
