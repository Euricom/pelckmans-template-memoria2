const Control = createClass({
  valueCache: new Map(),
  imageUploaded: false,
  ref: 'iimg-ref',
  imageUrl: '',
  imageWidth: 0,
  imageHeight: 0,
  pointsLength: 0,

  componentWillUpdate() {
    if (this.imageUploaded && !!this.refs[this.ref]) {
      const { width, height } = this.refs[this.ref].getBoundingClientRect();
      this.imageWidth = width;
      this.imageHeight = height;
    }
  },
  handleImageInput(evt) {
    const [file] = evt.target.files;
    if (file) {
      this.imageUrl = URL.createObjectURL(file);
      this.imageUploaded = true;
    } else {
      this.imageUploaded = false;
    }
    this.forceUpdate();
  },
  handleRemoveImage() {
    this.imageUrl = '';
    this.imageUploaded = false;
    this.valueCache.clear();
    this.forceUpdate();
  },
  handlePointMetaInput(e, key) {
    if (this.valueCache.has(key)) {
      this.valueCache.set(key, {
        ...this.valueCache.get(key),
        metaData: {
          tooltip: e.target.value
        }
      });
    }
    this.triggerChangeUpdate(this.props.value.image, { points: this.valueCache });
  },
  handleImageClick(e) {
    if (!e) return;
    const rect = e.target.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const key = `point-${this.valueCache.size}`;

    const xPercentage = `${(x / rect.width) * 100}%`;
    const yPercentage = `${(y / rect.height) * 100}%`;

    // save state
    this.valueCache.set(key, { ...this.valueCache.get(key), x: xPercentage, y: yPercentage });
    // update cms value
    this.triggerChangeUpdate({}, { points: this.valueCache });
  },
  triggerChangeUpdate(imageData, pointsData) {
    this.props.onChange({
      image: {
        ...imageData
      },
      ...pointsData
    });
  },
  renderPoints() {
    return Array.from(this.valueCache.entries()).map(point => {
      const key = point[0];
      const value = point[1];
      const styleObject = {};
      const style = {
        ...this.setPointStyles(styleObject),
        ...this.setPointPosition(styleObject, value)
      };
      return h(
        'span',
        {
          'data-key': key,
          style
        },
        ''
      );
    });
  },
  renderImage() {
    const randomId = '_' + Math.random().toString(36).substring(4, 9);
    const args = {
      img: {
        id: randomId,
        ref: 'iimg-ref', // sets ref
        src: this.imageUrl,
        className: 'iimg-image',
        onClick: this.handleImageClick
      },
      button: {
        onClick: this.handleRemoveImage
      }
    };

    return h('div', { className: 'iimg-image-wrapper' }, [
      h('div', { className: 'iimg-points-wrapper' }, [this.renderPoints(), h('img', args.img)]),
      h('button', args.button, `Remove image`)
    ]);
  },
  renderFileInput() {
    const args = {
      type: 'file',
      accept: 'image/png, image/jpeg, image/png, image/jpg',
      onInput: this.handleImageInput
    };
    return h('input', args);
  },
  renderPointsMetaData() {
    const args = {
      type: 'text',
      style: {
        border: '1px solid black'
      }
    };
    return Array.from(this.valueCache.keys()).map(key => {
      return [h('span', {}, key), h('input', { ...args, onInput: e => this.handlePointMetaInput(e, key) })];
    });
  },
  setPointStyles(styleObject) {
    styleObject.position = 'absolute';
    styleObject.width = '30px';
    styleObject.height = '30px';
    styleObject.display = 'block';
    styleObject.background = '#fff';
    styleObject.borderRadius = '50%';
    styleObject.transform = 'translate(-50%, -50%)';
    return styleObject;
  },
  setPointPosition(styleObject, { x, y }) {
    styleObject.left = `${x}`;
    styleObject.top = `${y}`;
    return styleObject;
  },
  render: function () {
    return h('div', null, [
      this.imageUploaded
        ? [this.renderImage(), this.valueCache.size !== 0 ? this.renderPointsMetaData() : null]
        : this.renderFileInput()
    ]);
  }
});

const Preview = createClass({
  mounted: false,
  imgPreview: {
    imgUrl: '',
    parentDivElement: HTMLElement,
    element: HTMLElement,
    dimensions: {
      width: 0,
      height: 0
    }
  },
  componentDidMount() {
    this.setElement();
    this.setDimensions();
    this.addPointsToPreview();
    this.mounted = true;
  },

  setElement() {
    const previewPane = document.querySelector('#preview-pane');
    this.imgPreview.element = previewPane.contentWindow.document.querySelector('img');
    if (this.imgPreview && this.imgPreview.element) {
    }
    this.imgPreview.parentDivElement = this.imgPreview.element ? this.imgPreview.element.parentNode : null;
  },
  setDimensions() {
    const { element } = this.imgPreview;
    this.imgPreview.dimensions.width = element.width;
    this.imgPreview.dimensions.height = element.height;
  },
  addPointsToPreview() {
    console.log(this.props.value);
    // get image parent div
    const imageParentDiv = this.imgPreview.element.parentElement;
    // set position relative on image parent div
    imageParentDiv.style.position = 'relative';

    // if(!!this.props.value && Array.isArray(this.props.value)){
    //   this.props.value.map()
    //   // create span points
    //   const point = document.createElement('span');
    //   // set span styling absolute
    //   this.setPointStyles(point);
    //   this.setPointPosition(point, { x: this.randomPoint.x, y: this.randomPoint.y });
    //   // add span elements with this.randomPoint properties
    //   imageParentDiv.append(point);
    // }
  },
  componentDidUpdate() {
    console.log('componentDidUpdate');
  },
  render: function () {
    // const { value } = this.props;
    console.log('rerender preivew');
    if (this.mounted) {
      this.addPointsToPreview();
    }

    return h('p', {});
  }
});

export { Control, Preview };
