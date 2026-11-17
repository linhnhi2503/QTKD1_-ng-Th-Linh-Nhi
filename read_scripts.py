with open('scratch_script_1.js', 'r', encoding='utf-8') as f:
    print('--- Script 1 ---')
    print(f.read())

with open('scratch_script_2.js', 'r', encoding='utf-8') as f:
    s2 = f.read()
    print('--- Script 2 (first 500 chars) ---')
    print(s2[:500])
