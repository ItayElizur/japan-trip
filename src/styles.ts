const css = `
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;}
body{margin:0;padding:0;}
.jp-app{font-family:'Heebo','Segoe UI',Arial,sans-serif;direction:rtl;}
.jp-title{font-family:'Heebo',serif;font-weight:300;font-size:34px;letter-spacing:-0.02em;text-align:center;margin:0 0 4px;}
.jp-subtitle{text-align:center;font-size:14px;color:var(--color-text-secondary);margin:0 0 20px;}
.jp-nav{display:flex;gap:4px;background:var(--color-background-secondary);border-radius:28px;padding:4px;border:0.5px solid var(--color-border-tertiary);width:fit-content;}
.jp-nav-btn{padding:8px 16px;border-radius:22px;border:none;background:transparent;cursor:pointer;font-size:13px;font-family:'Heebo',sans-serif;font-weight:400;color:var(--color-text-secondary);transition:all 0.18s;}
.jp-nav-btn.active{background:var(--color-background-primary);color:var(--color-text-primary);font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,0.1);}
.jp-region-btn{padding:7px 16px;border-radius:22px;border:1.5px solid var(--color-border-tertiary);background:transparent;cursor:pointer;font-size:13px;font-family:'Heebo',sans-serif;color:var(--color-text-secondary);transition:all 0.18s;}
.jp-tag-btn{padding:4px 12px;border-radius:14px;border:1px solid var(--color-border-tertiary);background:transparent;cursor:pointer;font-size:12px;font-family:'Heebo',sans-serif;color:var(--color-text-secondary);transition:all 0.15s;}
.jp-vote-btn{flex:1;border:1.5px solid var(--color-border-tertiary);background:transparent;border-radius:10px;padding:6px 4px;cursor:pointer;font-size:15px;transition:all 0.15s;}
.jp-card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:14px;padding:14px 16px;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column;}
.jp-card:hover{border-color:var(--color-border-secondary);transform:translateY(-1px);}
.jp-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px;}
.jp-modal{background:#ffffff;border-radius:18px;padding:24px;max-width:520px;width:100%;max-height:88vh;overflow-y:auto;border:1px solid #e5e7eb;direction:rtl;color:#111827;}
.jp-modal.dark{background:#1f2937;border-color:#374151;color:#f9fafb;}
.jp-modal-muted{color:#6b7280!important;}.jp-modal.dark .jp-modal-muted{color:#9ca3af!important;}
.jp-close-btn{background:#f3f4f6;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;color:#6b7280;flex-shrink:0;}
.jp-modal.dark .jp-close-btn{background:#374151;color:#d1d5db;}
.jp-modal-vote-btn{flex:1;border:1.5px solid #e5e7eb;border-radius:12px;padding:12px 8px;cursor:pointer;text-align:center;transition:all 0.15s;background:#f9fafb;font-family:'Heebo',sans-serif;}
.jp-modal.dark .jp-modal-vote-btn{background:#374151;border-color:#4b5563;}
.jp-modal-vote-btn.active{background:#fff;}.jp-modal.dark .jp-modal-vote-btn.active{background:#1f2937;}
.jp-map-container{border-radius:12px;overflow:hidden;border:1px solid var(--color-border-secondary);}
.jp-comment-bubble{background:#f9fafb;border-radius:10px;border:0.5px solid #e5e7eb;padding:10px 14px;margin-bottom:8px;}
.jp-modal.dark .jp-comment-bubble{background:#374151;border-color:#4b5563;}
.jp-modal-input{width:100%;padding:10px 14px;border-radius:10px;border:1px solid #d1d5db;background:#fff;color:#111827;font-size:14px;font-family:'Heebo',sans-serif;outline:none;}
.jp-modal.dark .jp-modal-input{background:#374151;border-color:#4b5563;color:#f9fafb;}
.jp-modal-send{padding:10px 18px;border:1px solid #d1d5db;border-radius:10px;background:#f3f4f6;cursor:pointer;font-size:14px;font-family:'Heebo',sans-serif;color:#111827;font-weight:500;white-space:nowrap;}
.jp-modal.dark .jp-modal-send{background:#374151;border-color:#4b5563;color:#f9fafb;}
.jp-modal-divider{border:none;border-top:0.5px solid #e5e7eb;margin:0;}
.jp-modal.dark .jp-modal-divider{border-color:#374151;}
.jp-dark-btn{padding:7px 14px;border-radius:20px;border:0.5px solid var(--color-border-secondary);background:transparent;cursor:pointer;font-size:13px;font-family:'Heebo',sans-serif;color:var(--color-text-secondary);display:flex;align-items:center;gap:5px;}
.jp-map-card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:12px;padding:10px 14px;text-decoration:none;color:var(--color-text-primary);display:block;}
.jp-map-card:hover{border-color:var(--color-border-secondary);}
.day-col{background:var(--color-background-secondary);border-radius:12px;min-height:100px;padding:8px;border:2px solid transparent;transition:border-color 0.15s;}
.day-col.drag-over{border-color:#3B82F6;background:#EFF6FF;}
.itin-chip{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:9px;padding:7px 9px;margin-bottom:5px;cursor:grab;user-select:none;}
.itin-chip:active{opacity:0.7;}
.fav-chip{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:9px;padding:7px 10px;cursor:grab;user-select:none;display:flex;align-items:center;gap:7px;margin-bottom:5px;}
.fav-chip:active{opacity:0.6;}
.travel-badge{display:flex;align-items:center;gap:3px;font-size:10px;color:var(--color-text-secondary);padding:2px 0 4px;border-top:0.5px dashed var(--color-border-tertiary);margin-top:3px;}
.fest-card{border-radius:12px;padding:14px 16px;cursor:pointer;transition:border-color 0.15s;}
.fest-card:hover{filter:brightness(0.97);}
`;

export default css;
