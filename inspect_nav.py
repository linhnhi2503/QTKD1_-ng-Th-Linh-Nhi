with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for i in range(4):
    pos = text.find(f'id="viewStep{i}"')
    next_view_pos = text.find(f'id="viewStep{i+1}"') if i < 3 else text.find('</main>')
    chunk = text[pos:next_view_pos]
    buttons = re.findall(r'<button[^>]*>.*?</button>', chunk, re.DOTALL)
    print(f'=== Step {i} has {len(buttons)} buttons ===')
    for b in buttons:
        cleaned = ' '.join(b.split())
        if any(k in cleaned.lower() for k in ['trang', 'bước', 'tiếp', 'quay', 'goto', 'approve', 'sau', 'trước']):
            print('  ->', cleaned[:140])
