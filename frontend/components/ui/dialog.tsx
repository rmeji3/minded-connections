"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(39,35,32,0.58)",
        ...style,
      }}
      {...props}
    />
  );
}

function DialogContent({
  style,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          /* padding on top and right creates room for the floating close button */
          paddingTop: 20,
          paddingRight: 20,
          width: "calc(100% - 2rem)",
          maxWidth: 660,
          outline: "none",
          ...style,
        }}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

export { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogTitle, DialogDescription };

