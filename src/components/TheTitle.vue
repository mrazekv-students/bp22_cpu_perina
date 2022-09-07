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
                <span> {{ this.author + ', ' + this.date }} </span>
            </div>
            <icon-button displayIcon="fa-solid fa-info" :function="ToggleAbout" :tooltip="tooltips.help" class="title-button" />
            <icon-button displayIcon="fa-solid fa-gear" :function="ToggleSettings" :tooltip="tooltips.settings" class="title-button"/>
        </div>
    </div>

    <Teleport to="body">
        <the-about :show="showAbout" @close="ToggleAbout" />
        <the-settings :show="showSettings" @close="ToggleSettings" />
    </Teleport>
</template>

<script>
import IconButton from './common/IconButton.vue';
import TheAbout from './TheAbout.vue';
import TheSettings from './TheSettings.vue';
export default {
    name: "TheTitle",
    components: { IconButton, TheAbout, TheSettings },
    emits: ["UpdateSettings"],
    
    props: {
        title: { type: String, required: true },
        author: { type: String },
        organisation: { type: String },
        suborganisation: { type: String },
        date: { type: String }
    },

    data() {
        return {
            showAbout: false,
            showSettings: false,
            tooltips: {
                settings: "Show settings",
                help: "About application"
            }
        }
    },

    methods: {
        ToggleAbout() {
            this.showAbout = !this.showAbout;
        },

        ToggleSettings() {
            if (this.showSettings) {
                this.$emit("UpdateSettings");
            }
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
.title-container img {
    height: 3.5rem;
    border-radius: 100%;
    margin-left: 0.5rem;
    margin-right: 1rem;
}
.title-container .title {
    font-size: 3rem;
    font-weight: bold;
    text-transform: uppercase;
}
.title-container .additional-info {
    align-items: flex-end;
    margin-left: auto;
    color: var(--scrollColorLight);
}

.title-container .title-button {
    width: 3.5rem;
    height: 3.5rem;
    margin-left: 0.5rem;
    border-radius: 10px;
    font-size: 2rem;
    background: var(--mainColorDark);
}

.close-button {
    width: 2rem;
    height: 2rem;
    margin-left: auto;
    border-radius: 5px;
    font-size: 1.5rem;
}
</style>
