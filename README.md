# Transformed Images Element

## What this is
This custom element functions similarly to the **Asset** element, but allows an editor to apply the Image Transformation API to any selected image.

Confused?
- What is Kentico Cloud: [Get started with Kentico Cloud](https://docs.kenticocloud.com/tutorials/get-started-with-kentico-cloud)
- What is a custom element: [Integrating your own content editing features](https://developer.kenticocloud.com/docs/integrating-content-editing-features)

In action:
![ElementInAction](https://user-images.githubusercontent.com/34716163/55026851-35778180-4fda-11e9-878f-f790ed4bedb3.gif)

## How to set it up

1. Use a project on the Enterprise plan.
2. Create or use an existing content type.
3. Drag in **Custom element** from the tray on the right.
4. In the element configuration, provide these values:
   - **Hosted code URL (HTTPS)**: `https://yuriys-kentico.github.io/Kentico/TransformedImagesElement/element`
   - **Parameters {JSON}**:
     ```
     {
        "contentManagementAPIKey": <Key value from Project settings > API Keys > Content Management API>,
        "editorDefaultToPreview": <Optional: "true" or "false" (without quotes) to preview transformations in the editor by default>,
        "editorDefaultCropType": <Optional: One of the following default crop modes: "box", "zoom", "frame">,
        "editorDefaultResizeType": <Optional: One of the following default resize modes: "scale", "fit">,
        "colorPickerDefaultColors": <Optional: Array of default colors like ["#RRGGBBAA", "#4caf50", ...]>
     }
     ```
5. Make sure to have some image assets.
6. Create a new item using this content type.
7. Start transforming some images!

## Want to see the source?
Here it is: [TransformedImagesElement](https://github.com/yuriys-kentico/TransformedImagesElement)
