########### Python 3.2 #############
import urllib.request, json

try:
    url = "https://api.wmata.com/TrainPositions/TrainPositions?contentType=json"

    hdr ={
    'api_key': '04a7469a0ade4e6aaf5de8e60375c7ae',
    }

    req = urllib.request.Request(url, headers=hdr)

    req.get_method = lambda: 'GET'
    response = urllib.request.urlopen(req)
    print(response.read())
except Exception as e:
    print(e)
####################################