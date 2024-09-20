<!-- 
  * paramater
  {
    height: 높이, px (Number),
    readonly: 읽기전용 여부 (Boolean),
    content: 본문 내용 (String),
  }
 -->

<template>
  <div>
    <div>
      <div ref="editor"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineExpose, watch } from "vue";

import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const editor = ref("");
const editorRef = ref("");
const height = ref(0);
const contentHtml = ref("");

const props = defineProps({
  params: {
    height: {
      type: Number,
      default: 0,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
  },
}
)

// 에디터 내용을 html로 전달
const getHtmlContent = () => {
  return contentHtml.value;
}

// html을 에디터에 세팅 (setHTML이 적용이 안돼서 editor 초기화)
const setHtmlContent = (content) => {
  contentHtml.value = content;
  setEditor();
}

// toast editor 초기화
const setEditor = () => {
  // 파라미터 setting
  if (props) {
    height.value = props.params.height ? props.params.height : height.value;
    contentHtml.value = props.params.content ? props.params.content : contentHtml.value;
  }

  editorRef.value = Editor.factory({
    el: editor.value,
    minHeight: '300px',
    height: `${height.value}px`,
    initialEditType: 'wysiwyg',
    viewer: props.params.readonly,
    initialValue: contentHtml.value || ' ',
    hideModeSwitch: true,
    language: 'ko',
    events: {
      change: () => {
        // 수정 시 contentHTML에 실시간 데이터 반영
        const html = editorRef.value.getHTML();
        contentHtml.value = html;
      },
    },
    hooks: {
      // TODO 이미지파일 서버 올리도록 저장
      // addImageBlobHook: (blob, callback) => {
      //   console.log(callback);
        // let url = '/images/';
        // 	$.ajax({
        //      		type: 'POST',
        //      		enctype: 'multipart/form-data',
        //      		url: '/writeTest.do',
        //      		data: formData,
        //      		dataType: 'json',
        //      		processData: false,
        //      		contentType: false,
        //      		cache: false,
        //      		timeout: 600000,
        //      		success: function(data) {
        //      			//console.log('ajax 이미지 업로드 성공');
        //      			url += data.filename;
                  
        //      			// callback : 에디터(마크다운 편집기)에 표시할 텍스트, 뷰어에는 imageUrl 주소에 저장된 사진으로 나옴
        //   			// 형식 : ![대체 텍스트](주소)
        //      			callback(url, '사진 대체 텍스트 입력');
        //      		},
        //      		error: function(e) {
        //      			//console.log('ajax 이미지 업로드 실패');
        //      			//console.log(e.abort([statusText]));
                  
        //      			callback('image_load_fail', '사진 대체 텍스트 입력');
        //      		}
        //      	});
      // }
    }
  });
}

onMounted (() => {
  setEditor();
})

defineExpose({
	getHtmlContent,
  setHtmlContent,
})

</script>

<style scoped>
</style>