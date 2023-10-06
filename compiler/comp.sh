#/bin/bash

args=("$@")
file=${args[0]}

cp $file $file.bak
as --32 -g $file.s -o $file.o
ld -m elf_i386 -o $file $file.o
