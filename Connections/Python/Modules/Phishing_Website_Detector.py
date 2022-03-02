from unshortenit import UnshortenIt
from pysafebrowsing import SafeBrowsing

class URL:
    def __init__(self):
        # * Extension list
        with open('./Docs/Dangerous_Extension.txt', 'r') as Dangerous_Extensions_Opener:
            Dangerous_Extensions_Reader = Dangerous_Extensions_Opener.read()

        self.Dangerous_Extensions = Dangerous_Extensions_Reader.split(',')

        # * Google API key
        self.Google_API_Key = 'AIzaSyBsz3N1Pn5IvocCPJMXuAfLL3UrjRew0Do'

    def __enter__(self):
        return self

    def __exit__(self):
        pass

    def Url_Lengthner(self, Input_URL):
        # @param Input_URL
        Unshortner = UnshortenIt()
        Proper_URL = Unshortner.unshorten(Input_URL)
        return Proper_URL

    def Url_Analyser(self, Input_URL):
        # @param Input_URL
        # * URL Splitter
        Url_Splitter = Input_URL.split('.')
        Main_Part_Splitter = Url_Splitter[1]
        Main_Part = None
        try:
            Main_Part = int(Main_Part_Splitter)
        except ValueError:
            Main_Part = Main_Part_Splitter

        # * Phishing Detector
        Search_1 = SafeBrowsing(self.Google_API_Key)
        Search = Search_1.lookup_urls([Input_URL])
        Parameters = Search[Input_URL]
        Malicious = Parameters['malicious']
        try:
            Threats = Parameters['threats']
        except KeyError:
            Threats = None

        # * Explanation List
        Explanation_List = []

        # * Detects if a URL is an IP address
        Number_of_dots = Input_URL.count('.')
        Integer_or_Not = isinstance(Main_Part, int)
        if Integer_or_Not and Number_of_dots >= 3:
            Ip_address = 'URL is most probably an IP Address'
            Explanation_List.append(Ip_address)

        # * Checks if the URL is an email address
        At_symbol = Input_URL.count('@')
        if At_symbol >= 1:
            Email_ID = 'URL is probably an Email ID'
            Explanation_List.append(Email_ID)

        # * Checks whether the URL uses HTTP or HTTPS
        Detect_if_Https_or_Https = Input_URL[0:5]
        Https_or_Http = Detect_if_Https_or_Https.count('s')
        if Https_or_Http != 1:
            Http = 'This site uses unsafe HTTP protocol'
            Explanation_List.append(Http)

        # * Checks which extension URL uses
        Extension = Url_Splitter[-1]
        if Extension in self.Dangerous_Extensions:
            Extension1 = 'This URL has the extension .' + Extension + ' which can be dangerous'
            Explanation_List.append(Extension1)

        return Explanation_List, Malicious, Threats

# Output Malicious, Threat, Explanation_List, Proper_URL
