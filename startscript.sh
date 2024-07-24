#!/bin/sha
screen -S server -d -m /home/jonas/mc/starserter9.sh
screen -S server -X multiuser on
screen -S server -X acladd jonas
screen -S server -X acladd root