"""Genera una página de juegos estilo Wordwall (assets/ww.js) desde un JSON de lección.
Uso: python3 ww_juego.py datos.json carpeta_salida  [extra.json con groups/speak/games]"""
import json,sys,os,html
d=json.load(open(sys.argv[1])); out=sys.argv[2]
if len(sys.argv)>3: d.update(json.load(open(sys.argv[3])))
ww={k:d[k] for k in('tag','title','sub','pairs','qs','items','groups','speak','games','home') if k in d}
ww.setdefault('home','https://app.elevionis.com')
os.makedirs(out,exist_ok=True)
t=html.escape(d.get('short',d.get('title','Games')))
open(os.path.join(out,'index.html'),'w').write(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{t} | Elevionis</title><link rel="icon" type="image/svg+xml" href="../assets/favicon.svg"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../assets/elevionis.css"><link rel="stylesheet" href="../assets/ww.css"></head><body><script>window.WW={json.dumps(ww,ensure_ascii=False)};</script><script src="../assets/ww.js"></script></body></html>''')
print('ok',out)
