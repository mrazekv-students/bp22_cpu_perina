<!--
    The title component
!-->

<template>
    <div class="horizontal-container title-container">
        <h1 class="title"> {{ title }} </h1>
        <div class="vertical-container additional-info">
            <span> {{ organisation }} </span>
            <span> {{ suborganisation }} </span>
            <span> {{ authorDate }} </span>
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
.title-container {
    width: 100%;
    min-width: 1250px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 2rem;
    padding-right: 0.4rem;
    background: var(--mainColor);
}
.title-container>.title {
    font-size: 3rem;
    font-weight: bold;
    text-transform: uppercase;
}
.title-container>.additional-info {
    margin-left: auto;
    align-items: flex-end;
    color: var(--scrollColorLight);
}
</style>
