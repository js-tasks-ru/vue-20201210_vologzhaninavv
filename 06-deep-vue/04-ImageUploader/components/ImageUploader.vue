<template>
  <div class="image-uploader">
    <label
      class="image-uploader__preview"
      :class="{'image-uploader__preview-loading': loading}"
      :style="bgStyle"
    >
      <span>{{ label }}</span>
      <input
        type="file"
        accept="image/*"
        class="form-control-file"
        :disabled="loading"
        @click="resetImage"
        @change="change"
      />
    </label>
  </div>
</template>

<script>
import { ImageService } from '../image-service';

export default {
  name: 'ImageUploader',

  model: {
    prop: 'imageId',
    event: 'change'
  },

  props: {
    imageId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      loading: false
    }
  },

  computed: {
    bgStyle() {
      let bgStyle = {};

      // если есть ид изображения, то вывыдем его фоном
      if (this.imageId !== null) {
        bgStyle = {
          '--bg-image': `url('${ImageService.getImageURL(this.imageId)}')`
        };
      }

      return bgStyle;
    },
    label() {
      if (this.loading) {
        return 'Загрузка...';
      }

      if (this.imageId !== null) {
        return 'Удалить изображение';
      }

      return 'Загрузить изображение';
    }
  },

  methods: {
    change($event) {
      const files = $event.target.files;
      if (!(files && files[0])) {
        return;
      }

      this.loading = true;

      ImageService.uploadImage(files[0])
        .then(image => {
          const imageId = (image.id || image.id === 0) ? image.id : null;
          this.$emit('change', imageId);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    resetImage($event) {
      // если уже выбрано изображение, то сбросить его
      if (this.imageId) {
        $event.preventDefault();
        $event.target.value = null;
        this.$emit('change', null);
      }
    }
  }
};
</script>

<style scoped>
.image-uploader .form-control-file {
  opacity: 0;
  height: 0;
}

.image-uploader .image-uploader__preview {
  --bg-image: var(--default-cover);
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4)
    ),
    var(--bg-image);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  transition: 0.2s border-color;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 512px;
  height: 228px;
}

.image-uploader .image-uploader__preview > span {
  color: var(--white);
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}

.image-uploader .image-uploader__preview:hover {
  border-color: var(--blue);
}

.image-uploader .image-uploader__preview.image-uploader__preview-loading {
  cursor: no-drop;
}
</style>
