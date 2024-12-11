const CapsuleDetail = () => {
  const imgs = [
    'https://i.pinimg.com/736x/40/7b/51/407b51c07793e2fd1cddbbc05607c933.jpg',
    'https://i.pinimg.com/736x/8f/1b/6b/8f1b6bd31e2db05d42259e382bf4c080.jpg',
    'https://i.pinimg.com/736x/8a/72/3f/8a723f1174c15037584f0e0a7ef6e1b1.jpg',
    'https://i.pinimg.com/736x/34/78/be/3478bec5cfb90230997eb0efb47eca40.jpg',
    'https://i.pinimg.com/736x/ca/fc/5d/cafc5d15b672823c64398303905978a8.jpg',
    'https://i.pinimg.com/736x/d6/f1/59/d6f159b8075ebd21ac6c3fa9a9530584.jpg'
  ];

  return (
    <div>
      <div>
        <strong>@user_nickname</strong>
        <span>님이 작성한 타임캡슐</span>
      </div>
      <ul>
        {imgs.map((img, i) => (
          <li key={i} className="aspect-square">
            <img src={img} alt={`타임캡슐 썸네일 ${i + 1}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CapsuleDetail;