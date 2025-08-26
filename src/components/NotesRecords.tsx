import React, { useState, useRef, useEffect } from "react";
import { Heart, Reply, Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Dummy users for comments
const USERS = [
  { id: 1, name: "Jane Cooper" },
  { id: 2, name: "Sam Lee" },
  { id: 3, name: "You" },
];

// Dummy comments, "You" = me, rest are others
const INIT_COMMENTS = [
  {
    id: 101,
    userId: 1,
    name: "Jane Cooper",
    text: "Client is making good progress on their stress reduction goal.",
    time: "2025-06-08 10:23",
    likes: 3,
    replies: [],
    mentions: [],
  },
  {
    id: 102,
    userId: 3,
    name: "You",
    text: "Thanks for the update @Sam Lee! Let's review again after the next session.",
    time: "2025-06-08 10:55",
    likes: 2,
    replies: [
      {
        id: 201,
        userId: 2,
        name: "Sam Lee",
        text: "Agreed! Will add my notes after tomorrow’s appointment.",
        time: "2025-06-08 11:12",
        likes: 1,
        replies: [],
        mentions: [],
      }
    ],
    mentions: ["Sam Lee"],
  },
  {
    id: 103,
    userId: 2,
    name: "Sam Lee",
    text: "Just added new outcomes from the care plan.",
    time: "2025-06-08 11:34",
    likes: 0,
    replies: [],
    mentions: [],
  },
];

// Add 15 dummy notes for scrolling
const INIT_COMMENTS_LONG = [
  ...INIT_COMMENTS,
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: 1000 + i,
    userId: (i % 3) + 1,
    name: USERS[(i % 3)].name,
    text: `Sample note ${i + 1}: This is a longer dummy note to show how scrolling looks in the Internal Notes tab.`,
    time: `2025-06-08 1${i+2}:37`,
    likes: i % 4,
    replies: [],
    mentions: [],
  }))
];

const NotesRecords: React.FC = () => {
  const [comments, setComments] = useState(INIT_COMMENTS_LONG);
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [replyQuote, setReplyQuote] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when a new comment is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments.length]);

  // "current user"
  const CURRENT_USER = { id: 3, name: "You" };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Math.floor(Math.random() * 100000),
        userId: CURRENT_USER.id,
        name: "You",
        text: newComment,
        time: new Date().toLocaleString("en-US", {
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit"
        }).replace(",", ""),
        likes: 0,
        replies: [],
        mentions: Array.from(newComment.matchAll(/@([\w\s]+)/g)).map(match => match[1]),
      },
    ]);
    setNewComment("");
    setReplyQuote(null); // Clear after posting
  };

  const handleLike = (id: number, replyIndex?: number) => {
    setComments(comments => comments.map(comment => {
      if (comment.id === id && replyIndex == null) {
        return { ...comment, likes: comment.likes + 1 };
      }
      if (replyIndex != null && comment.replies && comment.replies[replyIndex]) {
        const replies = comment.replies.map((r, i) =>
          i === replyIndex ? { ...r, likes: r.likes + 1 } : r
        );
        return { ...comment, replies };
      }
      return comment;
    }));
  };

  const handleReply = (id: number, text: string) => {
    // Inserts formatted quote into the main textarea (with blockquote style)
    const quote = `> ${text.replace(/\n/g, '\n> ')}`;
    setReplyQuote(quote);
    setNewComment(
      quote +
        (newComment.trim() && !newComment.startsWith(">") ? "\n\n" + newComment : "")
    );
    // Focus main textarea after setting
    setTimeout(() => {
      const textarea = document.getElementById("notes-main-textarea");
      textarea?.focus();
    });
  };

  const handleEdit = (id: number, text: string) => {
    setEditId(id);
    setEditValue(text);
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editValue.trim() || editId == null) return;
    setComments(comments => comments.map(comment =>
      comment.id === editId ? { ...comment, text: editValue } : comment
    ));
    setEditId(null);
    setEditValue("");
  };

  // Helper: returns tailwind string for own/others comments
  const bubbleClass = (isMine: boolean) =>
    isMine
      ? "bg-primary text-white rounded-br-none ml-auto"
      : "bg-muted text-gray-800 rounded-bl-none";

  return (
    <div className="bg-white dark:bg-card border rounded-lg shadow-sm flex flex-col h-full">
      <div className="p-0 flex-1 flex flex-col min-h-0">
        <div
          className="flex-1 overflow-y-auto px-2 py-2 space-y-6"
          ref={scrollRef}
          style={{ maxHeight: "480px", minHeight: "200px" }}
        >
          {comments.map((comment, idx) => {
            const isMine = comment.userId === CURRENT_USER.id;
            return (
              <div key={comment.id} className={cn(
                "flex flex-col gap-2", isMine ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "flex items-end gap-2", isMine ? "justify-end" : ""
                )}>
                  {/* Avatar */}
                  {!isMine && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold shrink-0">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  {/* Comment bubble */}
                  <div className={cn(
                    "max-w-[80vw] md:max-w-[500px] p-3 rounded-lg shadow-sm relative group flex-1",
                    bubbleClass(isMine)
                  )}>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{comment.name}</span>
                      {/* ADJUST TIMESTAMP COLORS BASED ON BUBBLE COLOR */}
                      <span
                        className={
                          isMine
                            ? "text-xs text-white font-semibold" // White timestamp for blue
                            : "text-xs text-gray-600 font-semibold" // Darker grey for muted
                        }
                      >
                        {comment.time}
                      </span>
                    </div>
                    {editId === comment.id ? (
                      <form onSubmit={handleEditSubmit} className="flex flex-col gap-2 mt-2">
                        <Textarea
                          autoFocus
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="resize-none text-sm bg-white border p-2"
                          rows={2}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button type="submit" size="sm" variant="default">Save</Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setEditId(null)}>Cancel</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-1 text-sm break-words">
                        {comment.mentions?.length ? (
                          <>
                            {comment.text.split(/(@[\w\s]+)/g).map((seg, i) =>
                              seg.startsWith("@") ? <span key={i} className="text-blue-600 font-medium">{seg}</span> : seg
                            )}
                          </>
                        ) : comment.text.startsWith(">") ? (
                          // Visually format blockquote for replied/quoted comment
                          <pre className={cn(
                            "bg-muted px-2 py-1 border-l-4 border-primary rounded-sm whitespace-pre-line text-xs mb-1",
                            "text-gray-600"
                          )}>{comment.text}</pre>
                        ) : comment.text}
                      </div>
                    )}
                  </div>
                  {isMine && (
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center font-bold shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className={cn(
                  "flex gap-2 text-xs mt-1 px-2",
                  isMine ? "justify-end" : ""
                )}>
                  <button
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors",
                      isMine ? "text-primary" : "text-gray-600"
                    )}
                    onClick={() => handleLike(comment.id)}
                  >
                    <Heart className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                  {!isMine && (
                    <>
                      <button
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                        onClick={() => handleReply(comment.id, comment.text)}
                      >
                        <Reply className="h-3 w-3" />
                        <span>Reply</span>
                      </button>
                      <button
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                        onClick={() => setEditId(comment.id)}
                        style={{ opacity: 0, pointerEvents: "none" }}
                        aria-hidden
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    </>
                  )}
                  {isMine && (
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                      onClick={() => handleEdit(comment.id, comment.text)}
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 flex flex-col gap-2">
                    {comment.replies.map((reply, i) => {
                      const isMyReply = reply.userId === CURRENT_USER.id;
                      return (
                        <div key={reply.id} className={cn(
                          "flex items-end gap-2",
                          isMyReply ? "justify-end" : ""
                        )}>
                          {!isMyReply && (
                            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <div className={cn(
                            "max-w-[350px] p-2 rounded-lg shadow relative",
                            isMyReply
                              ? "bg-primary text-white rounded-br-none ml-auto"
                              : "bg-muted text-gray-800 rounded-bl-none"
                          )}>
                            <div className="flex justify-between">
                              <span className="font-medium text-xs">{reply.name}</span>
                              <span className={
                                isMyReply
                                  ? "text-xs text-white"
                                  : "text-xs text-gray-600"
                              }>
                                {reply.time}
                              </span>
                            </div>
                            <div className="mt-1 text-xs">{reply.text}</div>
                          </div>
                          {isMyReply && (
                            <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center font-bold">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          <button
                            className={cn(
                              "flex items-center gap-1 text-xs hover:text-primary ml-2"
                            )}
                            onClick={() => handleLike(comment.id, i)}
                          >
                            <Heart className="h-3 w-3" />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Reply form */}
                {/* NO direct reply input here now! */}
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t bg-muted/50 px-4 py-3">
        <form className="flex gap-2 items-center" onSubmit={handleAddComment}>
          <Textarea
            className="flex-1 resize-none"
            id="notes-main-textarea"
            placeholder="Add an internal note... (use @ to mention others)"
            aria-label="Add note"
            rows={2}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <Button
            size="sm"
            type="submit"
            disabled={!newComment.trim()}
            className="h-10"
          >
            Post
          </Button>
        </form>
        {/* Show preview of reply quote above the input, if present */}
        {replyQuote && (
          <div className="mt-2 mb-1">
            <div className="bg-muted px-3 py-2 border-l-4 border-primary rounded text-xs text-gray-600 whitespace-pre-line">
              {replyQuote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesRecords;
