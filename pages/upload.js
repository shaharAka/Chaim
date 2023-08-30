const mobileStyles = {
    button: {
      padding: '15px 30px',
      fontSize: '1.2em',
    },
    input: {
      fontSize: '1.2em',
    },
    container: {
      padding: '20px',
    },
    title: {
      fontSize: '2em',
    },
    guideText: {
      fontSize: '1.2em',
      fontWeight: 'bold',
    }
  };

  return (
    <div style={mobileStyles.container}>
      <LeftMenu />
      <h1 style={mobileStyles.title}>Upload Image</h1>
      <form onSubmit={submitHandler}>
        <input type="file" onChange={fileChangedHandler} style={mobileStyles.input} />
        <button type="submit" style={mobileStyles.button}>Upload</button>
      </form>
      {originalImageUrl && 
        <div>
          <ReactCrop
            src={originalImageUrl}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            style={{maxWidth: "400px", maxHeight: "400px"}}
          />
          <div style={mobileStyles.guideText}>Drag a segmentation area around the wound</div>
          <button onClick={segmentHandler} style={mobileStyles.button}>Segment!</button>
        </div>}
      {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{width: "400px", height: "400px"}} />}
      <div>
        {maskArea !== undefined && 
          <div className="info-box">
            <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>
            <p>Delta E Value: {deltaEValue.toFixed(2)}</p> 
          </div>
        }
      </div> 
    </div>
  );
}
