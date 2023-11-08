import React from 'react';
import './index.less';

export default function InfiniteScroll() {
  const [list, setList] = React.useState(new Array(10).fill(null));
  const lastContentRef = React.useRef(null);
  function loadMore() {
    setList((prev) => [...prev, ...new Array(10).fill(null)]);
  }

  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        loadMore();
      }
    });
    lastContentRef?.current && io.observe(lastContentRef?.current);
  }, []);

  return (
    <div className="container">
      {list.map((item, index) => (
        <div key={index} className="content-item">
          content-{index}
        </div>
      ))}
      <div ref={lastContentRef}></div>
    </div>
  );
}
