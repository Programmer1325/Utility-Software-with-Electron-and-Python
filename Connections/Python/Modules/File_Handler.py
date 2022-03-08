from os import remove
from cryptography.fernet import Fernet
from base64 import urlsafe_b64encode as B64Encode
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from datetime import datetime


class File_Handler:
    def __init__(self, Input_Password):
        # * Salt
        Salt_file = open('./Private/Salt_For_Files.txt', 'rb')
        Salt_File_Read = Salt_file.read()

        # * Decrypt salt file
        Salt_Key = b'dygp-egWkJa7t0d77h_kOyGyDrMys78lpxBzW-lLFlc='

        Salt_Fernet_Key = Fernet(Salt_Key)

        Salt = Salt_Fernet_Key.decrypt(Salt_File_Read)
        Salt_file.close()

        # * Fernet Key Generator with Password
        Key_Derivative_Function = PBKDF2HMAC(algorithm=hashes.SHA256(),
                                             length=32,
                                             salt=Salt,
                                             iterations=320000)

        Password = Input_Password.encode()
        Key = B64Encode(Key_Derivative_Function.derive(Password))

        self.Fernet_Key = Fernet(Key)
        self.Input_Password = Input_Password

    def __enter__(self):
        return self

    def __exit__(self, self1, self2, self3):
        pass

    def WriteHistory(self, File_Path, History):
        Name = File_Path.split('/')[-1]

        History = '%s with name %s on %s with path %s\n' % (
            History, Name, datetime.now().strftime('%a %d %b %Y %I:%M %p'), File_Path)

        with open('./Data/File_History.txt', 'a') as File_Open:
            File_Open.write(History)

    def Encrypt_File(self, File_Path):
        with open(File_Path, 'rb') as Open_File:
            Read_file = Open_File.read()
            # * Encrypt File
            Encrypted_file = self.Fernet_Key.encrypt(Read_file)

        with open(File_Path, 'wb+') as Write_Open_File:
            Write_Open_File.write(Encrypted_file)

        self.WriteHistory(File_Path, 'Encrypted')
        return 'File Encrypted Successfully'

    def Decrypt_File(self, File_Path):
        # * Open and Read file
        with open(File_Path, 'rb') as Open_File:
            Read_Encrypted_file = Open_File.read()

            # * Decrypt file
            Decrypted_file = self.Fernet_Key.decrypt(Read_Encrypted_file)

        # * Open and Write file
        with open(File_Path, 'wb+') as Write_Open_File:
            Write_Open_File.write(Decrypted_file)

        self.WriteHistory(File_Path, 'Decrypted')
        return 'File Decrypted Successfully'

    def Delete_File(self, File_Path):
        Key = Fernet.generate_key()
        Encryption_Key = Fernet(Key)

        # * Open File to read
        with open(File_Path, 'rb') as File_Open:
            File_Read = File_Open.read()

        # * Encrypt file
        File_Encrypt = Encryption_Key.encrypt(File_Read)

        # * Open File to write
        with open(File_Path, 'wb') as File_Open_Write:
            File_Open_Write.write(File_Encrypt)

        # * Delete File
        remove(File_Path)

        self.WriteHistory(File_Path, 'Deleted')
        return 'File Deleted Successfully'
