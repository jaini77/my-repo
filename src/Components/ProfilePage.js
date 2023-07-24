import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { database } from "../Config";
import { onValue, ref, get } from "firebase/database";
import Slider from "react-slick";
import ShowPost from "./ShowPost";

function ProfilePage() {
  const [userData, setUserData] = useState([]);
  const [post, setPost] = useState([]);
  const [favPost, setFavPost] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [noData, setNodata] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  var LikeTemp = [];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const myFavPost = async (newPost, temp) => {
    var newPost = newPost;
    var temp = temp;
    for (let i = 0; i < newPost.length; i++) {
      if (newPost[i].fav == undefined) {
        continue;
      } else {
        setIsFav(true);
        var fav = newPost[i].fav;
        console.log("fav:", fav);
        await fav.map((favData) => {
          if (favData.user_id === temp.email) {
            setFavPost((current) => [...current, newPost[i]]);
          }
        });
      }
    }
    return favPost;
  };

  const myLikePost = async (newPost, temp) => {
    var newPost = newPost;
    var temp = temp;
    for (let i = 0; i < newPost.length; i++) {
      if (newPost[i].like == undefined) {
        continue;
      } else {
        setIsLike(true);
        setIsFav(false);
        var like = newPost[i].like;
        console.log(" for looop wala like:", like);
        await like.map((likeData) => {
          if (likeData.user_id === temp.email) {
            setPost((current) => [...current, newPost[i]]);
          }
        });
      }
    }
    
    // return post;
  };

  useEffect(async () => {
    const temp = JSON.parse(localStorage.getItem("user"));
    setUserData([temp]); // Wrap temp inside an array
    console.log("User Data:", temp);

    const Ref = ref(database, "post/");
    const snapshot = await get(Ref);
    const data = snapshot.val();

    if (data) {
      const newPost = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      console.log("newPost:", newPost);

      await myFavPost(newPost, temp);
      await myLikePost(newPost, temp);
      setIsLoading(!isLoading);
      console.log("isLoading:", isLoading);
      console.log("isfav:", isFav);
      console.log("isLike:", isLike);
    }
  }, []);
  const likePost = () => {
    setIsLike(!isLike);
    console.log("after click likes:", post);
    console.log("isloading in like:", isLoading);
    if (isFav === true) {
      setIsFav(!isFav);
    }
  };
  const favPostClick = () => {
    setIsFav(!isFav);
    if (isLike === true) {
      setIsLike(!isLike);
    }
    console.log("after cilcking the fav:", favPost);
  };
  return (
    <>
      <div className="row">
        {userData.map((item, index) => (
          <div className="row justify-content-center" key={index}>
            <div
              className="col-4"
              style={{ textAlign: "center" }}
              id="mainCard"
            >
              <img
                src={item.photoUrl}
                className="mr-3 rounded-circle"
                alt="Profile Picture"
                style={{ width: 60 }}
              />

              <div className="row">
                <div className="col-12" style={{ textAlign: "center" }}>
                  <h5 className="mt-0">{item.name}</h5>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="text-muted mt-2" id="insediconId">
                    <div className="profileMedIaIcon1">
                      <span
                        onClick={() => likePost()}
                        id={isLike ? "blue" : "gry"}
                      >
                        <i className="fa-sharp fa-solid fa-thumbs-up fa-2xl" />
                      </span>
                      <p className="likeCount">{post.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-muted mt-2">
                    <span
                      onClick={() => favPostClick()}
                      id={isFav ? "red" : "gry"}
                    >
                      <i className="fa-sharp fa-solid fa-heart fa-2xl" />
                    </span>
                    <p className="likeCount">{favPost.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row justify-content-center">
        {!isLoading ? (
          <div className="col-12" style={{ textAlign: "center" }}>
            {post && !post.length && favPost && !favPost.length ? (
              <div>
                {userData.map(
                  (
                    item,
                    index // Use parentheses instead of curly braces
                  ) => (
                    <div className="row justify-content-center" key={index}>
                      <div id="mainCard" className="col-auto">
                        {/* <div className="card-body"> */}
                        <h5 className="mt-2" style={{ fontFamily: "arial" }}>
                          {item.name} u have no like and Favorite yet click{" "}
                          <a href="Home">home</a>to see post
                        </h5>
                      </div>
                    </div>
                    // </div>
                  )
                )}
              </div>
            ) : (
              <></>
            )}
            {isLike ? (
              <div>
                {post && !post.length ? (
                  <div>
                    {userData.map(
                      (
                        item,
                        index // Use parentheses instead of curly braces
                      ) => (
                        <div className="row justify-content-center" key={index}>
                          <div className="col-12" id="mainCard">
                            {/* <div className="card-body"> */}
                            <h5
                              className="mt-0"
                              style={{ fontFamily: "arial" }}
                            >
                              {item.name} u have no like yet click{" "}
                              <a href="Home">home</a>to see post
                            </h5>
                          </div>
                          {/* </div> */}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  
                  <ShowPost post={post} />
                )}
              </div>
            ) : (
              ""
            )}
            {isFav ? (
              <div>
                {favPost && !favPost.length ? (
                  <div>
                    {userData.map(
                      (
                        item,
                        index // Use parentheses instead of curly braces
                      ) => (
                        <div className="row justify-content-center" key={index}>
                          <div className="col-auto" id="mainCard">
                            {/* <div className="card-body"> */}
                            <h5
                              className="mt-0"
                              style={{ fontFamily: "arial" }}
                            >
                              {item.name} u have no Favorite yet click{" "}
                              <a href="Home">home</a>to see post
                            </h5>
                          </div>
                          {/* </div> */}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <ShowPost post={favPost} />
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default ProfilePage;
