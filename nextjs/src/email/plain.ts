export const adminText = (r: any) =>
  [
    `Method: ${r.method}`,
    `Name: ${r.name || ''}`,
    `Email: ${r.email || ''}`,
    `Address: ${r.address || ''}`,
    `Item: ${r.item_title || ''} (ID: ${r.item_id || ''})`,
    `Note: ${r.note || ''}`,
    `IP: ${r.ip || ''}`,
    `UA: ${r.ua || ''}`,
  ].join('\n');
