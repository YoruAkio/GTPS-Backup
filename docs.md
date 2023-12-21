## Windows Command Promt

Move File on Windows Command Promt:
move {option} source destination
option:
/y: do not prompt before overwriting existing files
/-y: prompt before overwriting existing files

example: `move /y C:\Users\user\Desktop\test.txt C:\Users\user\Desktop\test2.txt`

## Windows Command Promt

Archiving Files on Windows Command Promt:
rar a {option} archive_name file_name
option:
-r : recursive

example: ` rar a test.rar test.txt // archive test.txt to test.rar`
`rar a -r test.rar test // archive all files in test folder to test.rar`

## Algorithm of Backup Script

1. Backup all database to a archive file with name "ServerDatabase-Backup.rar"
2. Move the archive file to a folder named "Backup" in the same directory as the script
3. Backup the archive file to a cloud storage
4. Rename the archive file to "ServerDatabase-Backup-{date}-{hours-minutes}.rar"
5. Send logs and information about the file to discord webhook