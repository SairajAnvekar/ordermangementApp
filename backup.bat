@echo off

REM move into the backups directory
CD d:\database_backups
D:


REM Create a file name for the database output which contains the date and time. Replace any characters which might cause an issue.
set filename=database %date% %time%
set filename=%filename:/=-%
set filename=%filename: =__%
set filename=%filename:.=_%
set filename=%filename::=-%

REM Export the database
echo Running backup "%filename%"
"C:\Program Files\MongoDB\Server\4.0\bin\mongodump.exe" --db orderManager --out %filename%

echo BACKUP COMPLETE

exit 