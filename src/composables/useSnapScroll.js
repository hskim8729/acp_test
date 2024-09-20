import { onMounted, onUnmounted, ref } from "vue";

/**
 * useSnapScroll composable
 *
 * 이 composable은 Vue 컴포넌트에서 스냅 스크롤 기능을 구현하는 데 사용됩니다.
 * 스크롤 시 각 자식 요소로 부드럽게 이동하는 기능을 제공합니다.
 *
 * @param {Object} options - 스크롤 동작을 커스터마이즈하기 위한 옵션 객체
 * @param {number} [options.threshold=50] - 스크롤 감지를 위한 임계값 (픽셀 단위)
 * @param {number} [options.animationDuration=500] - 스크롤 애니메이션 지속 시간 (밀리초 단위)
 *
 * @returns {Object} 스냅 스크롤 기능을 제어하기 위한 객체
 * @returns {Ref<Element>} containerRef - 스크롤 컨테이너에 연결할 ref 객체
 * @returns {Ref<number>} currentIndex - 현재 표시 중인 자식 요소의 인덱스
 * @returns {Function} scrollToElement - 특정 인덱스의 자식 요소로 스크롤하는 함수
 */
export function useSnapScroll(options = {}) {
  const { threshold = 50, animationDuration = 500 } = options;

  // 스크롤 컨테이너에 대한 참조
  const containerRef = ref(null);
  // 현재 표시 중인 자식 요소의 인덱스
  const currentIndex = ref(0);
  // 스크롤 애니메이션 중 추가 스크롤을 방지하기 위한 플래그
  let isScrolling = false;

  /**
   * 특정 인덱스의 자식 요소로 스크롤합니다.
   * @param {number} index - 스크롤할 대상 자식 요소의 인덱스
   */
  const scrollToElement = (index) => {
    if (!containerRef.value) return;

    const children = containerRef.value.children;
    if (index < 0 || index >= children.length) return;

    isScrolling = true;
    children[index].scrollIntoView({ behavior: "smooth" });

    // 애니메이션이 완료된 후 상태를 업데이트합니다.
    setTimeout(() => {
      isScrolling = false;
      currentIndex.value = index;
    }, animationDuration);
  };

  /**
   * 휠 이벤트 핸들러
   * 스크롤 방향에 따라 다음 또는 이전 요소로 스크롤합니다.
   * @param {WheelEvent} event - 휠 이벤트 객체
   */
  const handleWheel = (event) => {
    if (isScrolling) return;

    const delta = event.deltaY;
    // 작은 스크롤 움직임은 무시합니다.
    if (Math.abs(delta) < threshold) return;

    const direction = delta > 0 ? 1 : -1;
    const nextIndex = currentIndex.value + direction;

    scrollToElement(nextIndex);
  };

  // 컴포넌트가 마운트될 때 휠 이벤트 리스너를 추가합니다.
  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
  });

  // 컴포넌트가 언마운트될 때 휠 이벤트 리스너를 제거합니다.
  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener("wheel", handleWheel);
    }
  });

  return {
    containerRef,
    currentIndex,
    scrollToElement,
  };
}

// 사용 예시:
//
// import { useSnapScroll } from '@/composables/useSnapScroll';
//
// const { containerRef, currentIndex, scrollToElement } = useSnapScroll({
//   threshold: 30,
//   animationDuration: 800
// });
//
// // 템플릿에서 containerRef 사용:
// // <div ref="containerRef">...</div>
//
// // 특정 요소로 프로그래매틱하게 스크롤:
// // scrollToElement(2); // 세 번째 요소로 스크롤
