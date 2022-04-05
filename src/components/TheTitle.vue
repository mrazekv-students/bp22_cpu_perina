<!--
    The title component
!-->

<template>
    <div class="horizontal-container title-bar">
        <div class="horizontal-container title-container">
            <img src="../../assets/logo.png" alt=".">
            <h1 class="title"> {{ title }} </h1>
            <div class="vertical-container additional-info">
                <span> {{ organisation }} </span>
                <span> {{ suborganisation }} </span>
                <span> {{ authorDate }} </span>
            </div>
            <icon-button :displayIcon="'fa-solid fa-gear'" :function="ToggleSettings" class="settings-button"/>
        </div>
    </div>

    <Teleport to="body">
        <the-settings :show="showSettings" @close="ToggleSettings"/>
    </Teleport>
</template>

<script>
import IconButton from './common/IconButton.vue';
import TheSettings from './TheSettings.vue';
export default {
    name: "TheTitle",
    components: { IconButton, TheSettings } ,
    
    props: {
        title: { type: String, required: true },
        author: { type: String },
        organisation: { type: String },
        suborganisation: { type: String },
        date: { type: String }
    },

    computed: {
        authorDate() {
            return this.author + ', ' + this.date;
        }
    },

    data() {
        return {
            showSettings: false
        }
    },

    methods: {
        ToggleSettings() {
            this.showSettings = !this.showSettings;
        }
    }
}
</script>

<style>
.title-bar {
    justify-content: center;
    width: 100%;
    background: var(--mainColor);
}
.title-container {
    justify-content: left;
    width: 100%;
    max-width: 1400px;
    padding: 0.5rem;
}
.title-container>img {
    height: 3.5rem;
    border-radius: 100%;
    margin-left: 0.5rem;
    margin-right: 1rem;
}
.title-container>.title {
    font-size: 3rem;
    font-weight: bold;
    text-transform: uppercase;
}
.title-container>.additional-info {
    align-items: flex-end;
    margin-left: auto;
    color: var(--scrollColorLight);
}
.title-container>.settings-button {
    width: 3.5rem;
    height: 3.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 10px;
    font-size: 2rem;
    background: var(--mainColorDark);
}
</style>
