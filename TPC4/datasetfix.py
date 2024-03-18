import json
import chardet

def read_json(fp):
    bd = []
    with open(fp, 'rb') as f:
        result = chardet.detect(f.read())
    with open(fp, 'r', encoding=result['encoding']) as f:
        bd = json.load(f)        
    return bd
def create_periodos(bd):
    periodos = []
    for compositor in bd["compositores"]:
        print("Periodo: ", compositor.get('periodo', ""))
        if compositor.get('periodo', "") not in periodos and compositor.get('periodo', "") != "":
            periodos.append(compositor.get('periodo', ""))
    return periodos


bd = read_json("compositores.json")
print(create_periodos(bd))