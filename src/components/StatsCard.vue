<template>
    <div class="stats shadow">
        <div class="stat">
            <div class="stat-figure text-2xl">{{ icon }}</div>
            <div class="stat-title">{{ title }}</div>
            <div class="stat-value" :class="`text-${color}`">{{ value }}</div>
            <div class="stat-desc" v-if="trend">
                <span class="text-success">{{ trend }}</span> em relação ao mês anterior
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string
    value: string | number
    icon: string
    color?: string
    trend?: string
}

withDefaults(defineProps<Props>(), {
    color: 'primary',
    trend: ''
})
</script>