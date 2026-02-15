import json
import os

# הנתיב לקובץ שלך בתיקיית ההורדות
input_file = os.path.expanduser(r'~\Downloads\app.biblingo.org.har')
output_file = 'compact_biblingo_data.json'

print("--- מתחיל ניקוי נתונים עבור Jerusalem Bridge ---")

if not os.path.exists(input_file):
    print(f"שגיאה: הקובץ לא נמצא בנתיב: {input_file}")
    print("וודא ששם הקובץ בתיקיית Downloads הוא בדיוק app.biblingo.org.har")
else:
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        compact_entries = []
        for entry in data['log']['entries']:
            url = entry['request']['url']
            # סינון קריאות API רלוונטיות בלבד
            if any(keyword in url for keyword in ['api', 'lesson', 'content', 'vocabulary', 'grammar']):
                content = entry['response'].get('content', {})
                if 'text' in content:
                    compact_entries.append({
                        'url': url,
                        'data_json': content['text']
                    })

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(compact_entries, f, ensure_ascii=False, indent=2)

        print(f"הצלחה! נוצר קובץ קומפקטי: {output_file}")
        print(f"גודל הקובץ החדש קטן משמעותית ומוכן לניתוח ב-Cursor.")
    except Exception as e:
        print(f"קרתה שגיאה בזמן הניתוח: {e}")
