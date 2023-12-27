# TIPS

## Updating the script

```bash
git pull

# if you found an error from git pull, try this
git fetch --all
git reset --hard origin/master
```

## Easy way to use this script

1. Download the executable file from [Releases](https://github.com/yoruakio/GTPS-Backup/releases)
2. Extract the file same as you database folder
3. Rename the config from `config.js.example` to `config.js`
4. Edit the config file
5. Run the executable file

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
