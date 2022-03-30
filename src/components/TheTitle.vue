<!--
    The title component
!-->

<template>
    <div class="horizontal-container title-bar">
        <div class="horizontal-container title-container">
            <h1 class="title"> {{ title }} </h1>
            <div class="vertical-container additional-info">
                <span> {{ organisation }} </span>
                <span> {{ suborganisation }} </span>
                <span> {{ authorDate }} </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TheTitle",
    
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
    justify-content: space-between;
    width: 100%;
    max-width: 1400px;
    padding: 0.5rem;
}
.title-container>.title {
    font-size: 3rem;
    font-weight: bold;
    text-transform: uppercase;
}
.title-container>.additional-info {
    align-items: flex-end;
    color: var(--scrollColorLight);
}
</style>
