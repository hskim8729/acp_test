<!-- 사인패드 -->

<template>
	<div class="content_box">
		<vue-drawing-canvas
			ref="VueCanvasDrawing"
			v-model:image="image"
			:width="300"
			:height="300"
			:stroke-type="strokeType"
			:line-cap="lineCap"
			:line-join="lineJoin"
			:fill-shape="fillShape"
			:eraser="eraser"
			:lineWidth="line"
			color="#000000"
			background-color="#ffffff"
			:background-image="backgroundImage"
			:watermark="watermark"
			:initial-image="initialImage"
			saveAs="png"
			:styles="{
				border: 'solid 1px #000',
			}"
			:lock="disabled"
			@mousemove="getCoordinate($event)"
			:additional-images="additionalImages"
		/>
		<!-- <div class="output">
			<p>Output:</p>
			<img :src="image" style="border: solid 1px #0000ff" />
		</div> -->
	</div>
	<button class="sign_reset" @click.prevent="$refs.VueCanvasDrawing.reset()">초기화</button>
</template>

<script>

</script>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import VueDrawingCanvas from 'vue-drawing-canvas';

//const VueCanvasDrawing = ref();
let initialImage = [
	{
		type: "dash",
		from: { x: 300, y: 300 },
		coordinates: [],
		color: "#0000FF",
		width: 5,
		fill: false
	}
]
const x = ref();
const y = ref();
const image = ref("");
const eraser = false;
const disabled = false;
const fillShape = false;
const line = 7;
const strokeType = "dash";
const lineCap = "round";
const lineJoin = "round";
const backgroundImage = null;
const watermark = null;
const additionalImages = ref([]); 


function getCoordinate(event) {
	let coordinates = VueDrawingCanvas.methods.getCoordinates(event);
	x.value = coordinates.x;
	y.value = coordinates.y;
}


onMounted(() => {
	x.value = 0;
	y.value = 0;
	image.value = "";
})

const getSign = async () => {

	const imgData = await fetch(image.value);
	const canvas = document.getElementById("VueDrawingCanvas");

	const data = {
		data: imgData,
		canvas:canvas,
	}

	return data;
}

defineExpose({
	getSign,
})

</script>

<style scoped>
.content_box {
	padding:0px;
	margin:0px;
}
</style>