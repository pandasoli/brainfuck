#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>

#define ERR unsigned short

ERR run(unsigned char *data, unsigned len, int mem_cap) {
	// Alloc memory for code
	void (*run)(unsigned char *mem) = mmap(NULL, len, PROT_EXEC | PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);

	if (run == MAP_FAILED) {
		perror("mmap");
		return 1;
	}

	memcpy(run, data, len);

	// Run code
	unsigned char *mem = malloc(mem_cap);
	memset(mem, 0, mem_cap);

	run(mem);

	// Free resources
	free(mem);
	munmap(run, len);

	return 0;
}
