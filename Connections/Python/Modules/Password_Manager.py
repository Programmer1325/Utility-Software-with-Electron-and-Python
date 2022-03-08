from base64 import urlsafe_b64encode as B64Encode
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from csv import reader
from collections import defaultdict
from json import dumps, loads


class Password_Manager:
    def __init__(self, MasterPassword):
        Salt_file = open('./Private/Salt_For_Passwords.txt', 'rb')
        Salt_File_Read = Salt_file.read()

        # * Decrypt salt file
        Salt_Key = b'3zWK67oj9BnCzkyj6lDSKUj7mmsCrSC1asVEA8zOcsQ='
        Salt_Fernet_Key = Fernet(Salt_Key)

        Salt = Salt_Fernet_Key.decrypt(Salt_File_Read)
        Salt_file.close()

        # * Fernet Key Generator with Password
        Key_Derivative_Function = PBKDF2HMAC(algorithm=hashes.SHA256(),
                                             length=32,
                                             salt=Salt,
                                             iterations=320000)

        Password = MasterPassword.encode()
        Key = B64Encode(Key_Derivative_Function.derive(Password))

        self.Fernet_Key = Fernet(Key)

        try:
            with open('./Private/Paths.csv', 'rb') as Reading_Password_File:
                self.CSV_File = self.Fernet_Key.decrypt(
                    Reading_Password_File.read()).decode().split('\n')

            with open('./Private/Password.json', 'rb') as Reading_Password_File:
                self.JSON_Parsed_Passwords = self.Fernet_Key.decrypt(
                    Reading_Password_File.read()).decode()
        except InvalidToken:
            print('Wrong Password')

    def __enter__(self):
        return self

    def __exit__(self, self1, self2, self3):
        pass

    def Get_ID(self, PasswordName):
        ID = 'Name does not exist'
        for List_Item in self.CSV_File:
            List_Item = List_Item.split(',')
            if PasswordName == List_Item[-1]:
                ID = List_Item[0]

        if ID == 'Name does not exist':
            raise SyntaxError('Name does not exist')

        return ID

    def InitialPassword(self, Username, Password):
        Encrypted_Password = self.Fernet_Key.encrypt(str({
            '1': [{"Username": Username, "Password": Password}]}).encode())

        with open('./Private/Password.json', 'wb') as Writing_Password:
            Writing_Password.write(Encrypted_Password)

    def InitialPath(self, Path, PasswordName):
        Path = '1' + ',' + Path + ',' + PasswordName

        Encrypted_Path = self.Fernet_Key.encrypt(
            Path.encode())

        with open('./Private/Paths.csv', 'wb') as Writing_Password:
            Writing_Password.write(Encrypted_Path)

    def Get_Path(self):
        CSV_Paths = []

        try:
            for Path in self.CSV_File:
                Path = ",".join(Path.split(',')[1:])
                CSV_Paths.append(Path)
        except AttributeError:
            return 'Wrong Password'

        def CreateTree():
            return defaultdict(CreateTree)

        def BuildLeaf(name, leaf):
            res = {"label": name}
            if len(leaf.keys()) > 0:
                res["children"] = [BuildLeaf(k, v) for k, v in leaf.items()]
            return res

        Tree = CreateTree()
        Reader = reader(CSV_Paths)
        for rid, row in enumerate(Reader):
            leaf = Tree[row[0]]
            for cid in range(1, len(row)):
                leaf = leaf[row[cid]]
        res = []
        for name, leaf in Tree.items():
            res.append(BuildLeaf(name, leaf))
        TreeData = dumps(res)

        return TreeData

    def Read_Key(self, PasswordName):
        ID = self.Get_ID(PasswordName)

        JSON_Passwords = dumps(loads(
            str(self.JSON_Parsed_Passwords).replace("'", '"'))[ID])

        return JSON_Passwords

    def Write_Password(self, PasswordName, Username_and_Password_Dictionary_String, Path):
        JSON_Password_Object = loads(
            str(self.JSON_Parsed_Passwords).replace("'", '"'))

        Existing_Paths_List = self.CSV_File
        Username_and_Password_Dictionary = loads(
            Username_and_Password_Dictionary_String)

        Names = []
        All_ID = []

        for Item in Existing_Paths_List:
            Item = Item.split(',')
            All_ID.append(Item[0])
            Names.append(Item[1])

        Recent_ID = int(All_ID[-1])
        Recent_ID += 1
        Recent_ID = str(Recent_ID)

        if PasswordName in Names:
            return 'Key already exists'
        else:
            if Path == '':
                Path = '%s,%s' % (Path, PasswordName)
            else:
                Path = '%s,%s,%s' % (Recent_ID, Path, PasswordName)

            New_Path = '\n'.join(self.CSV_File) + '\n' + Path
            JSON_Password_Object[Recent_ID] = [
                Username_and_Password_Dictionary]

            Encrypted_Path = self.Fernet_Key.encrypt(
                New_Path.encode())

            Encrypted_JSON_Object = self.Fernet_Key.encrypt(str(
                JSON_Password_Object).encode())

            with open('./Private/Paths.csv', 'wb') as Writing_Paths:
                Writing_Paths.write(Encrypted_Path)

            with open('./Private/Password.json', 'wb') as Writing_Password:
                Writing_Password.write(Encrypted_JSON_Object)

            return 'Key Stored successfully'

    def Edit_Key(self, PasswordName, Username_and_Password_Dictionary, PathToChange):
        ID = self.Get_ID(PasswordName)
        Username_and_Password_Dictionary = loads(
            Username_and_Password_Dictionary)

        def Edit_Username_or_Password(self, WhatToEdit, Username_or_Password):
            JSON_Passwords = loads(
                str(self.JSON_Parsed_Passwords).replace("'", '"'))

            JSON_Passwords[ID][0][WhatToEdit] = Username_or_Password

            Encrypted_JSON_Object = self.Fernet_Key.encrypt(str(
                JSON_Passwords).encode())

            with open('./Private/Password.json', 'wb') as Writing_Password:
                Writing_Password.write(Encrypted_JSON_Object)

        def Edit_Path(self):
            CSV_Paths = []
            for Path in self.CSV_File:
                if Path.split(',')[0] == ID:
                    CSV_Paths.append(
                        ID + ',' + PathToChange + ',' + PasswordName)
                else:
                    CSV_Paths.append(Path)

            Encrypted_Path = self.Fernet_Key.encrypt(
                '\n'.join(CSV_Paths).encode())

            with open('./Private/Paths.csv', 'wb') as Writing_Paths:
                Writing_Paths.write(Encrypted_Path)

        Things_Changed = []

        if PathToChange != '':
            if PathToChange == ' ':
                PathToChange = ''
            Edit_Path(self)
            Things_Changed.append('Path')

        if Username_and_Password_Dictionary['Username'] != '':
            Edit_Username_or_Password(
                self, 'Username', Username_and_Password_Dictionary['Username'])
            Things_Changed.append('Username')
        if Username_and_Password_Dictionary['Password'] != '':
            Edit_Username_or_Password(
                self, 'Password', Username_and_Password_Dictionary['Password'])
            Things_Changed.append('Password')

        return 'Edited ' + ', '.join(Things_Changed)

    def Delete_Key(self, PasswordName):
        ID = self.Get_ID(PasswordName)

        JSON_Passwords = loads(
            str(self.JSON_Parsed_Passwords).replace("'", '"'))

        JSON_Passwords.pop(ID)

        Encrypted_JSON_Object = self.Fernet_Key.encrypt(str(
            JSON_Passwords).encode())

        with open('./Private/Password.json', 'wb') as Writing_Password:
            Writing_Password.write(Encrypted_JSON_Object)

        CSV_Paths = []
        for Path in self.CSV_File:
            if Path.split(',')[0] != ID:
                CSV_Paths.append(Path)

        Encrypted_Path = self.Fernet_Key.encrypt(
            '\n'.join(CSV_Paths).encode())

        with open('./Private/Paths.csv', 'wb') as Writing_Paths:
            Writing_Paths.write(Encrypted_Path)

        print('Username and Password Deleted successfully')
