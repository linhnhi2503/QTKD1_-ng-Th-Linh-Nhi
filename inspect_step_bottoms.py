with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for i in range(4):
    start_tag = f'<div id="viewStep{i}"'
    pos = text.find(start_tag)
    print(f'=== viewStep{i} at {pos} ===')
    # print the last 600 chars before the next view or end
    end_pos = text.find(f'<div id="viewStep{i+1}"') if i < 3 else text.find('</main>')
    print('Length:', end_pos - pos)
    print('Bottom chunk:')
    print(text[end_pos-400:end_pos])
