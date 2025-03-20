"use client";

import React, { useState, useEffect } from "react";
import { Textarea, Text, Button, Card} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Comments: React.FC<{ productId: string }> = ({ productId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/products/${productId}/comments/many`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();

      const formattedData = data.map((cmt: any) => ({
        ...cmt,
        timestamp: cmt.timestamp ? new Date(cmt.timestamp).toLocaleString() : new Date().toLocaleString(),
      }));

      setComments(formattedData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:4000/products/${productId}/comments/binh-luan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      setNewComment("");
      fetchComments(); // Cập nhật danh sách
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 border rounded-lg shadow-md bg-white">

      <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
          css={{ width: '84%', marginBottom: '16px' }} 
          placeholder="Nhập bình luận của bạn. Tối thiểu 15 kí tự"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          minRows={5} 
        />
        <Button type="submit" color="secondary" className="w-full">
          Gửi bình luận
        </Button>
      </form>

      <div style={{ marginTop: '16px' }}>
      {comments.map((cmt, index) => (
        <Card key={index} css={{ width: '84%', marginBottom: '16px' }}>
          <Card.Body css={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                
                <div>
                <FontAwesomeIcon icon={faUser } size="1x" style={{ marginRight: '8px', color:'#7828C8' }} /> 
                  <Text b css={{ fontSize: '14px'}}>Người dùng ẩn danh</Text>
                </div> 
                <Text css={{ fontSize: '12px', color: '#7828C8' }}>
                {new Date(cmt.timestamp).toLocaleString()}
                </Text>
            </div>
              <Text css={{ fontSize: '16px', marginLeft: '2%' }}>{cmt.content}</Text>
          </Card.Body>
        </Card>
      ))}
    </div>
    </div>
  );
};

export default Comments;
