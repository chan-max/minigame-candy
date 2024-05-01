<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>
    
<script setup lang="ts">
import * as THREE from 'three'
import { createGame } from '..';
import { onMounted,ref } from 'vue'

const canvas = ref()

onMounted(() => {
    createGame({
        THREE,
        canvas: canvas.value
    })
})
</script>
    
<style></style>