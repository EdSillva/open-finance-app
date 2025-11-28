<template>
    <div class="drawer lg:drawer-open">
        <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />

        <!-- Página principal -->
        <div class="drawer-content flex flex-col">
            <!-- Navbar -->
            <div class="navbar bg-base-300 lg:hidden">
                <div class="flex-none">
                    <label for="drawer-toggle" class="btn btn-square btn-ghost">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </label>
                </div>
                <div class="flex-1">
                    <h1 class="text-xl font-bold">Open Finance Dashboard</h1>
                </div>
            </div>

            <!-- Conteúdo principal -->
            <main class="flex-1 p-6 bg-base-100">
                <router-view />
            </main>
        </div>

        <!-- Sidebar -->
        <div class="drawer-side">
            <label for="drawer-toggle" class="drawer-overlay"></label>
            <SidebarNavigation />
        </div>
    </div>

    <!-- Toast notifications -->
    <ToastBox />
</template>

<script setup lang="ts">
import SidebarNavigation from '@/components/SidebarNavigation.vue'
import ToastBox from '@/components/UI/ToastBox.vue'
</script>
