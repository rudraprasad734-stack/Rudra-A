import json,base64,glob,os
N={
'104M1ggmdcYI08onRFgAui2_GXIf_ilZG':'2023 Mains GS Paper I','1e2O2Un4ZTzIiU_EqE62d9B3u8FCnlX87':'2023 Mains GS Paper II','1KGDMDsTgeP7KugYIz23m8ybhVmwaw8r1':'2023 Mains GS Paper III','1ZmMxMqVDSrcU2pyvf9T7vZqaND_5Px8e':'2023 Mains GS Paper IV','1oMVbuCVbguFv6ZHt9Ob16cn7MjpyGbJ2':'2023 Mains Essay','1JHypG28Prti3T5MNPe8imHxA7jiU0yLv':'2023 Anthropology Paper I','1qkNi_2-oaLSoOWY5KkrlzP66w3MsBgTi':'2023 Anthropology Paper II',
'1ZadPfC2iFOtPBGP8oQAeYCtn6_8ypwe0':'2024 Mains GS Paper I','1RNeYxxArfOJ_0My33I8j6QRpq0IM_5Xx':'2024 Mains GS Paper II','1OOC6pPyr_s5fbsM49JxGx2Em8-HtvhLX':'2024 Mains GS Paper III','1Xk2RJQejTP3iNOLsv7ua6Jcv-RTVY2jg':'2024 Mains GS Paper IV','1TIqzVeUd9A4C5KfzTyNIdi9zoGlHlpht':'2024 Anthropology Paper I','1c-2_VgTNHjPsUIHBfmHHdfqMzeTV6Im2':'2024 Anthropology Paper II',
'1Pcn8u-AzrEVdxB3VTHsUq6knPyZirDJq':'2025 Mains GS Paper I','1kDjrnNFYLRkSw9kFsSuJdw5nJe6NIWf2':'2025 Mains GS Paper II','1fMLP16wbHoLVi3mN_SZYiL9sU5YDQTZ5':'2025 Mains GS Paper III','10wpwnRs5Sf_VRys86UfKdLoPadpOroNG':'2025 Mains GS Paper IV','1WY2JBGRF2y5DrufyLBh9uw5sD9EVJDSq':'2025 Anthropology Paper I','1fpEVNYEtP9D9EI4voBZMrhtxU0nslq07':'2025 Anthropology Paper II',
'1-YbQb5TWJAb20gTmhWkzoYteJiovwdoY':'2026 Mains GS Paper I','1zjyYYwlBsmv4JMnn3BCL5wyi21MKo4p_':'2026 Mains GS Paper II','16z3O4VqCr09oJxJo1k2XdOT8bQxRLXmG':'2026 Mains GS Paper III','19YcTrGrLw4Z23tWRWPURuAam1AteaE8u':'2026 Mains GS Paper IV','1mTXNumM068CwBeBfTNrNMgqDLpfCHmiG':'2026 Anthropology Paper I','1P4UpE9ASX9p9aGIBNE77s97mOJ0KOzWO':'2026 Anthropology Paper II'}
for f in glob.glob('/root/.claude/projects/-home-user-Rudra-A/8d6d6fe3-157c-5862-b382-28c5f4190943/tool-results/mcp-Google_Drive-download_file_content-*.txt'):
    try: d=json.load(open(f))
    except Exception: continue
    n=N.get(d.get('id'))
    if n and not os.path.exists('new/'+n+'.pdf'): open('new/'+n+'.pdf','wb').write(base64.b64decode(d['content']))
print(sorted(os.listdir('new')))
print('missing',[v for v in N.values() if not os.path.exists('new/'+v+'.pdf')])
