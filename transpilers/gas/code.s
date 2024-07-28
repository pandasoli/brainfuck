; vim:ft=asm

.data
	pointer: .long memory

.bss
	memory: .space 255
	input: .byte 0

.text
	.globl _start

plus:
	movl pointer, %eax

	movb (%eax), %bl
	incb %bl

	mov %bl, (%eax)
ret

minus:
	movl pointer, %eax

	movb (%eax), %bl
	decb %bl

	mov %bl, (%eax)
ret

ask:
	mov $3, %eax
	mov $0, %ebx
	movl $input, %ecx
	mov $1, %edx
	int $0x80

	# store received value
	movl pointer, %eax

	movb input, %bl
	movb %bl, (%eax)
ret

print:
	movl pointer, %ecx

	mov $4, %eax
	mov $1, %ebx
	mov $1, %edx
	int $0x80
ret

move_left:
	decb pointer
ret

move_right:
	incb pointer
ret

stop:
	mov $1, %eax
	xor %ebx, %ebx
	int $0x80

_start:
	# program
	movl pointer, %eax
	movb (%eax), %bl
	test %bl, %bl
	jz loop_0_end
	loop_0_begin:
		call minus
		call print

		movl pointer, %eax
		movb (%eax), %bl
		test %bl, %bl
		jnz loop_0_begin
		loop_0_end:

	# exit program
	call stop
