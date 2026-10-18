from lxml import etree
import xml.etree.ElementTree as ET, time
bomb='''<?xml version="1.0"?><!DOCTYPE l [<!ENTITY a "aaaaaaaaaa"><!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;"><!ENTITY c "&b;&b;&b;&b;&b;&b;&b;&b;&b;&b;"><!ENTITY d "&c;&c;&c;&c;&c;&c;&c;&c;&c;&c;">]><l>&d;</l>'''
print("X input bytes",len(bomb))
t=ET.fromstring(bomb); print("X stdlib ElementTree expanded text len",len(t.text))
try:
    p=etree.XMLParser(huge_tree=False); t=etree.fromstring(bomb.encode(),p); print("X lxml default expanded len",len(t.text))
except Exception as e: print("X lxml default rejected:",str(e)[:100])
xxe='<?xml version="1.0"?><!DOCTYPE d [<!ENTITY x SYSTEM "file:///etc/hostname">]><d>&x;</d>'
try:
    t=etree.fromstring(xxe.encode(),etree.XMLParser(resolve_entities=True)); print("X lxml resolve_entities=True reads local file ->",repr(t.text)[:40])
except Exception as e: print("X",e)
try:
    t=etree.fromstring(xxe.encode(),etree.XMLParser(resolve_entities=False,no_network=True)); print("X lxml resolve_entities=False ->",repr(t.text))
except Exception as e: print("X",e)
