; vim:ft=asm

.data
	ptr: .long mem
.bss
	mem: .space 255
.text
	.globl _start

plus:
	addb $1, (%rdi)
ret

minus:
	subb $1, (%rdi)
ret

print:
	push %rdi

	mov $1, %rax
	mov %rdi, %rsi
	mov $1, %rdi
	mov $1, %rdx
	syscall

	pop %rdi
ret

ask:
	push %rdi

	mov $0, %rax
	mov %rdi, %rsi
	mov $0, %rdi
	mov $1, %rdx
	syscall

	pop %rdi
ret

mleft:
	sub $1, %rdi
ret

mright:
	add $1, %rdi
ret

stop:
	mov $60, %rax
	xor %rdi, %rdi
	syscall

_start:
	mov ptr, %rdi
	call main
	call stop

main:
	addb $2, (%rdi)

	cmpb $0, (%rdi)
	jz .loop_0_end
	loop_0_begin:
		add $1, %rdi
		addb $3, (%rdi)
		sub $1, %rdi
		subb $1, (%rdi)

		cmpb $0, (%rdi)
		jnz loop_0_begin
		.loop_0_end:

	add $1, %rdi
	call print
	ret
