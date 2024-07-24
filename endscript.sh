#!/bin/sh
screen -S server -X stuff "stop$(printf \r)"
screen -S server -X stuff $'\003'