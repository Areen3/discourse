import I18n from "I18n";

// We need this to load after `upload-protocol` which is priority 0
export const priority = 1;

function isUpload(token) {
  return token.content.includes("upload://");
}

function buildVideoShowTimestampControls(videoTimestamp) {
  return `
  <span class="timestamp-readonly-container">
  <span class="timestamp-edit-btn">
  <svg aria-hidden="true" class="fa d-icon d-icon-pencil svg-icon svg-string"><use href="#pencil-alt"></use></svg>
</span>

  <span class="alt-text" aria-label="${I18n.t(
    "composer.video_timestamp.aria_label"
  )}">${videoTimestamp}</span>
  </span>
  `;
}

function buildThumbnail(timestamp) {
  return `
  <video id="thumb" controls preload="metadata" width="750px" height="540px">
    <source src="//localhost:3000/uploads/default/original/1X/f654a8514f2880e9205859d90c34ce88246880a4.mp4"
            type='video/mp4;codecs="avc1.42E01E, mp4a.40.2"'>
  </video>
  <canvas id="canvas"
          width="750px" height="540px"
          style="display:block;">
  </canvas>
  <div id="screenShots"></div>
  `;
}

function rule(state) {
  console.log('rule');
  console.log(state);
  let currentIndex = 0;

  for (let i = 0; i < state.tokens.length; i++) {
    let blockToken = state.tokens[i];
    const blockTokenVideo = blockToken.tag === "video";

  //  if (blockTokenImage && isUpload(blockToken) && hasMetadata(blockToken)) {
  //    appendMetaData(currentIndex, blockToken);
  //    currentIndex++;
  //  }

  //  if (!blockToken.children) {
  //    continue;
  //  }

  //  for (let j = 0; j < blockToken.children.length; j++) {
  //    let token = blockToken.children[j];
  //    const childrenImage = token.tag === "img";

  //    if (childrenImage && isUpload(blockToken) && hasMetadata(token)) {
  //      appendMetaData(currentIndex, token);
  //      currentIndex++;
  //    }
  //  }
  }
}

function ruleWithVideoControls(oldRule) {
  return function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    //const scaleIndex = token.attrIndex("scale");
    //const imageIndex = token.attrIndex("index-image");

    //if (scaleIndex !== -1) {
    //  let selectedScale = token.attrs[scaleIndex][1];
    //  let index = token.attrs[imageIndex][1];

    let result = `<span class="placeholder-icon">`;

    result += oldRule(tokens, idx, options, env, slf);

    result += `<span class="button-wrapper">`;
    result += buildVideoShowTimestampControls(1);
    //result += buildThumbnail(1);
    //  result += buildImageEditAltTextControls(
    //    token.attrs[token.attrIndex("alt")][1]
    //  );

    //  result += `<span class="scale-btn-container">`;
    //  result += SCALES.map((scale) =>
    //    buildScaleButton(selectedScale, scale)
    //  ).join("");
    //  result += `</span>`;
    //  result += buildImageDeleteButton();

    //  result += "</span></span>";

    return result;
    //} else {
      //return oldRule(tokens, idx, options, env, slf);
    //}
  };
}

export function setup(helper) {
  const opts = helper.getOptions();
  if (opts.previewing) {
    helper.allowList([
      "span[class=placeholder-icon]",
      "span[class=button-wrapper]",
      "svg[width]",
      "svg[height]",
      "svg[xmlns]",
      "svg[viewbox]",
      "path[fill]",
      "path[d]",
      "video[id]",
      "video[controls]",
      "video[preload]",
      "canvas",
      "div[id=screenshots]",
    ]);

    helper.registerPlugin((md) => {
      const oldRule = md.renderer.rules.image;

      md.renderer.rules.image = ruleWithVideoControls(oldRule);

      md.core.ruler.after("upload-protocol", "resize-controls", rule);
    });
  }
  var video = document.getElementById("thumb");
  console.log(video);
  //video.addEventListener("loadedmetadata", initScreenshot);
  ///video.addEventListener("playing", startScreenshot);
  ////video.addEventListener("pause", stopScreenshot);
  ////video.addEventListener("ended", stopScreenshot);

  //var canvas = document.getElementById("canvas");
  //var ctx = canvas.getContext("2d");
  //var ssContainer = document.getElementById("screenShots");
  //var videoHeight, videoWidth;
  //var drawTimer = null;


  function initScreenshot() {
    videoHeight = video.videoHeight;
    videoWidth = video.videoWidth;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    grabScreenshot();
  }

  function grabScreenshot() {
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    var img = new Image();
    img.src = canvas.toDataURL("image/png");
    img.width = 120;
    ssContainer.appendChild(img);
  }



}

